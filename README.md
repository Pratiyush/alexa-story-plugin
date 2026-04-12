# Its Story Time — Alexa Skill

Bilingual Indian folklore storytelling skill for Alexa. Tells stories in English and Hindi with expressive SSML narration, sound effects, and dramatic pauses.

**Invocation:** "Alexa, open its story time"

## Stories Included

| # | Story | Collection |
|---|-------|-----------|
| 1 | Leo and the Firefly | Original |
| 2 | The Monkey and the Crocodile | Panchatantra |
| 3 | Birbal Counts the Crows | Akbar-Birbal |
| 4 | Vikram and the Three Suitors | Vikram-Betaal |
| 5 | Tenali Raman and the Biggest Fool | Tenali Raman |

All stories available in both English and Hindi.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests (33 tests)
npm test

# Lint
npm run lint
```

## Project Structure

```
src/
  handler.js              # Main Lambda handler
  stories.js              # All story content (en + hi)
  utils/ssml.js           # SSML builder (converts effect tags)
  interactionModel.json   # English interaction model
  interactionModel.hi.json # Hindi interaction model
  skill.json              # Alexa skill manifest

lambda/                   # Alexa-hosted deployment copy
  index.js, stories.js, ssml.js, package.json

skill-package/            # ASK CLI skill package
  interactionModels/custom/
    en-IN.json, en-US.json, hi-IN.json

test/
  run-tests.js            # 33 unit + integration tests
  test-alexa-cli.sh       # E2E tests via ASK CLI
```

## ASK CLI Commands

```bash
# Install ASK CLI
npm install -g ask-cli

# Configure (opens browser for Amazon login)
ask configure

# List your skills
ask smapi list-skills-for-vendor

# Test skill (direct Lambda invoke)
ask smapi invoke-skill \
  --skill-id amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34 \
  --endpoint-region EU \
  --skill-request-body '{"version":"1.0","session":{"new":true,"sessionId":"t1","application":{"applicationId":"amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34"},"attributes":{},"user":{"userId":"u1"}},"context":{"System":{"application":{"applicationId":"amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34"},"user":{"userId":"u1"},"device":{"supportedInterfaces":{}}}},"request":{"type":"LaunchRequest","requestId":"r1","timestamp":"2026-04-12T18:00:00Z","locale":"en-IN"}}'

# Update interaction model
ask smapi set-interaction-model \
  --skill-id amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34 \
  --stage development --locale en-IN \
  --interaction-model "file:src/interactionModel.json"

# Check build status
ask smapi get-skill-status \
  --skill-id amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34
```

## Deploy to Alexa

### Manual Deploy (via git push to hosted skill)
```bash
# Clone hosted skill repo
ask init --hosted-skill-id amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34

# Copy source files to lambda/
cp src/handler.js <skill-dir>/lambda/index.js
cp src/stories.js <skill-dir>/lambda/stories.js
cp src/utils/ssml.js <skill-dir>/lambda/ssml.js
sed -i "s|require('./utils/ssml')|require('./ssml')|g" <skill-dir>/lambda/index.js

# Push to deploy
cd <skill-dir> && git add -A && git commit -m "Deploy" && git push
```

### Auto Deploy (GitHub Actions)
On push to `main`, the CI pipeline:
1. Runs lint + tests
2. Syncs code to Alexa-hosted CodeCommit repo
3. Updates interaction models

**Required GitHub Secrets:**
- `ASK_ACCESS_TOKEN` — from `~/.ask/cli_config`
- `ASK_REFRESH_TOKEN` — from `~/.ask/cli_config`
- `ASK_VENDOR_ID` — from `~/.ask/cli_config`
- `ALEXA_SKILL_ID` — `amzn1.ask.skill.5ccffded-9bba-4373-86c7-dbf610cc9b34`

## Adding a New Story

1. Edit `src/stories.js`
2. Add story object to both `en` and `hi` arrays:
```javascript
{
  id: 'story-slug',
  title: 'Story Title',
  category: 'panchatantra',
  content: 'Once upon a time… <chuckle> story text here. <gasp> More text. <sigh>'
}
```
3. Run `npm test` to verify SSML generation
4. Push to `main` — auto-deploys to Alexa

## SSML Effect Tags

| Tag | Effect | Alexa Output |
|-----|--------|-------------|
| `<chuckle>` | Light laugh | "tee hee" (en) / "हीही" (hi) |
| `<gasp>` | Surprise | "oh my" (en) / "अरे" (hi) |
| `<sniffle>` | Sad pause | 500ms silence |
| `<sigh>` | Relief | "ah" (en) / "आह" (hi) |
| `…` | Dramatic pause | 600ms silence |

## Voice Commands

| Say | What happens |
|-----|-------------|
| "Alexa, open its story time" | Launch — welcome message |
| "play a story" | Plays a random story |
| "play the monkey and the crocodile" | Plays specific story |
| "list stories" | Lists available stories |
| "Hindi" / "English" | Switch language |
| "play again" | Repeat current story |
| "help" | Usage instructions |
| "stop" | Exit skill |

## Phase 2 Roadmap

See [GitHub Issues](https://github.com/Pratiyush/alexa-story-plugin/issues) for full roadmap.

- **Phase 2a:** Move stories to S3/CDN (performance benchmark)
- **Phase 2b:** MP3 audio playback with metadata
- **Phase 2c:** Admin API for content management
- **Marketplace:** Alexa Skill Store submission

## Docs

- [LEARNING.md](LEARNING.md) — What we learned building this
- [STORY_WRITING_GUIDE.md](STORY_WRITING_GUIDE.md) — How to write stories in Alexa format
- [ADMIN_API_FUTURE.md](ADMIN_API_FUTURE.md) — Phase 2c API design
