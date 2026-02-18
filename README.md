## Alexa Story Player

This project contains an AWS Lambda function and Alexa skill configuration that plays the latest approved story MP3 from an S3 bucket or CDN URL.

### Prerequisites

- Node.js 18 or later
- AWS account with permission to deploy SAM stacks
- An S3 bucket containing a `latest.json` metadata file and MP3 assets

### Project structure

- `src/handler.js` – main Lambda handler for Alexa requests
- `src/utils/s3Client.js` – fetches `latest.json` from S3
- `src/interactionModel.json` – Alexa interaction model
- `src/skill.json` – Alexa skill manifest
- `template.yaml` – AWS SAM template
- `test/` – unit tests and sample Alexa requests

### Installing dependencies

```bash
npm install
```

### Running tests

```bash
npm test
```

This runs a small Node-based test harness that exercises:

- Fetching `latest.json` via the test override.
- Playing the latest story for `PlayLatestIntent`.
- Delegation from `LaunchRequest` to `PlayLatestIntent`.
- Repeat behavior using `RepeatOneIntent` and the AudioPlayer token.
- Help and fallback responses.

Sample request/response fixtures:

- `test/sample-launch-request.json`
- `test/sample-play-latest-intent.json`
- `test/expected-play-latest-response.json`

### Linting

```bash
npm run lint
```

### Deploying with SAM

Build and deploy using AWS SAM from the project root:

```bash
sam build
sam deploy --guided
```

During `sam deploy`, provide:

- `S3Bucket` – the bucket that contains `latest.json`
- `LatestJsonKey` – object key for `latest.json` (default `latest.json`)

### Connecting to Alexa console

1. Create a new Alexa custom skill in the Alexa Developer Console.
2. Set the invocation name to `story player`.
3. Import `src/interactionModel.json` into the interaction model editor.
4. Set the endpoint to the Lambda ARN output by the SAM deployment.
5. Enable the AudioPlayer interface for the skill.

### Testing the skill

Use the Alexa simulator or a device logged into your developer account and try:

- `Alexa, open Story Player`
- `Alexa, play latest story`
- `Alexa, ask Story Player to play`

The skill should fetch `latest.json`, extract `title` and `audio_url`, and send an `AudioPlayer.Play` directive for the associated MP3.

### Manual setup steps

You still need to complete these steps manually in your AWS and Alexa accounts:

- Create or choose an S3 bucket for story MP3s.
- Upload your MP3 file to S3 or a CDN and make it accessible to the skill.
- Create `latest.json` in the same bucket with contents similar to:

  ```json
  {
    "id": "story-2026-01",
    "title": "The Brave Little Mouse",
    "audio_url": "https://your-cdn-url/story-2026-01.mp3"
  }
  ```

- Deploy the SAM template and note the Lambda ARN output.
- In the Alexa Developer Console:
  - Configure the skill endpoint to use the Lambda ARN.
  - Ensure the skill has the AudioPlayer interface enabled.
  - Build the interaction model after importing `interactionModel.json`.
- (Optional) Configure CloudFront in front of S3 to serve MP3s from a CDN URL.
- (Optional) Configure a GitLab project that points at this repository so `.gitlab-ci.yml` is used.

### Next steps

- Implement the Admin API described in `ADMIN_API_FUTURE.md` to manage stories.
- Add DynamoDB and update workflows to keep `latest.json` in sync automatically.
- Add more robust logging and monitoring via CloudWatch for production.
- Expand tests to cover pause/resume flows end-to-end with real AudioPlayer events.
