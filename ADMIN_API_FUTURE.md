# Admin API (Future Design)

This document describes a future HTTP API for managing stories that can be consumed by the Alexa Story Player skill. The API is not implemented in this project yet; it defines the target design for a separate administrative backend.

## Goals

- Allow authenticated clients to upload, approve, and manage stories.
- Expose a clear workflow from upload to \"live\" status.
- Keep the Alexa skill runtime simple by reading the latest live story from S3.

## Authentication and Security

- All endpoints require an `x-api-key` header.
- Optional JWT-based authentication for richer user and role models.
- Secrets such as API keys and signing keys are stored in AWS Secrets Manager.

### x-api-key

- API Gateway usage plan and API key are used to control access.
- Requests without a valid key are rejected with HTTP `401 Unauthorized`.

### JWT (Optional)

- When enabled, clients send a `Authorization: Bearer <token>` header.
- JWT is validated by API Gateway or a Lambda authorizer.
- Token claims define roles such as `admin`, `editor`, or `viewer`.

### Secrets Management

- API keys, JWT signing secrets, and database credentials are kept in AWS Secrets Manager.
- Lambda functions read secrets at startup or via environment variables pointing to secret ARNs.

## Data Model

### Story

- `id`: string (unique identifier such as `story-2026-01`)
- `title`: string
- `description`: string
- `audio_url`: string (CDN or S3 URL to MP3)
- `text_body`: string (full story text)
- `status`: string enum: `uploaded`, `approved`, `live`, `archived`
- `uploaded_at`: ISO 8601 timestamp
- `approved_at`: ISO 8601 timestamp or null

### Storage

- Primary metadata stored in DynamoDB table `stories`.
- Audio files stored in S3 bucket.
- `latest.json` in S3 is updated whenever a story is marked live.

Example DynamoDB item:

```json
{
  "id": "story-2026-01",
  "title": "The Brave Little Mouse",
  "description": "A short bedtime story about courage.",
  "audio_url": "https://cdn.example.com/story-2026-01.mp3",
  "text_body": "Once upon a time...",
  "status": "live",
  "uploaded_at": "2026-01-01T10:00:00Z",
  "approved_at": "2026-01-01T11:00:00Z"
}
```

## Planned Endpoints

Base path: `/stories`

### POST /stories/upload

Uploads a new story record and initiates the review process.

- Request body:

```json
{
  "title": "The Brave Little Mouse",
  "description": "A short bedtime story about courage.",
  "audio_url": "https://cdn.example.com/story-2026-01.mp3",
  "text_body": "Once upon a time..."
}
```

- Behavior:
  - Generates a unique `id`.
  - Stores item in DynamoDB with `status = "uploaded"`.
  - Sets `uploaded_at` to the current timestamp.

- Response `201 Created`:

```json
{
  "id": "story-2026-01",
  "status": "uploaded"
}
```

### GET /stories

Lists stories with optional filtering.

- Query parameters (optional):
  - `status`: filter by status (`uploaded`, `approved`, `live`, `archived`).

- Response `200 OK`:

```json
[
  {
    "id": "story-2026-01",
    "title": "The Brave Little Mouse",
    "status": "live",
    "uploaded_at": "2026-01-01T10:00:00Z",
    "approved_at": "2026-01-01T11:00:00Z"
  }
]
```

### POST /stories/:id/approve

Marks a story as approved but not yet live.

- Path parameter:
  - `id`: story identifier.

- Behavior:
  - Validates that the story exists and is in `uploaded` status.
  - Updates `status` to `approved`.
  - Sets `approved_at` to the current timestamp.

- Response `200 OK`:

```json
{
  "id": "story-2026-01",
  "status": "approved"
}
```

### POST /stories/:id/mark-live

Marks a story as live and updates `latest.json` in S3.

- Path parameter:
  - `id`: story identifier.

- Behavior:
  - Validates that the story exists and is in `approved` or `live` status.
  - Updates `status` to `live`.
  - Writes `latest.json` in S3 with the following structure:

```json
{
  "id": "story-2026-01",
  "title": "The Brave Little Mouse",
  "audio_url": "https://cdn.example.com/story-2026-01.mp3"
}
```

- Response `200 OK`:

```json
{
  "id": "story-2026-01",
  "status": "live"
}
```

### DELETE /stories/:id

Soft-deletes or archives a story.

- Path parameter:
  - `id`: story identifier.

- Behavior:
  - Sets `status` to `archived`.
  - Optionally deletes or moves audio file in S3.

- Response `204 No Content`.

## Deployment Plan

### Core Services

- **API Gateway**  
  - Exposes REST endpoints under `/stories`.  
  - Enforces `x-api-key` and optional JWT authentication.  

- **AWS Lambda**  
  - Implements the business logic for each endpoint.  
  - Reads and writes to DynamoDB and S3.  

- **DynamoDB**  
  - Table `stories` keyed by `id`.  
  - Stores story metadata and status.  

- **S3**  
  - Bucket for MP3 assets.  
  - Object `latest.json` used by the Alexa skill.  

- **CloudWatch Logs**  
  - Captures access logs and Lambda logs for observability.  

### High-Level Flow

1. Client calls `POST /stories/upload` to register a new story.
2. Admin calls `POST /stories/:id/approve` after review.
3. Admin calls `POST /stories/:id/mark-live` to publish.
4. Lambda updates `latest.json` in S3 to reflect the new live story.
5. Alexa Story Player Lambda reads `latest.json` when users invoke the skill.

### Infrastructure as Code (Future)

- API Gateway, Lambda functions, DynamoDB table, and S3 bucket configuration are defined using CloudFormation or AWS SAM in a separate stack from the Alexa skill runtime.
- Secrets are referenced using AWS Secrets Manager ARNs.

