# Learning Notes — Alexa Story Time Skill

## What we built
A bilingual Alexa skill that tells stories in English and Hindi using TTS (text-to-speech) with SSML sound effects. Phase 1 uses bundled stories; Phase 2 will add MP3 audio playback.

---

## Key Concepts Learned

### 1. Alexa Skill Architecture
- **Interaction Model** — defines intents (what user can say), slots (variables), and sample utterances
- **Lambda Handler** — Node.js function that receives Alexa requests and returns SSML responses
- **Skill Manifest** (`skill.json`) — metadata, locales, endpoint configuration
- Each locale (en-IN, en-US, hi-IN) needs its own interaction model JSON

### 2. SSML (Speech Synthesis Markup Language)
Alexa uses SSML to control how text is spoken:
```xml
<speak>
  Hello! <break time="500ms"/> <!-- pause -->
  <say-as interpret-as="interjection">oh my</say-as> <!-- expressive word -->
  <prosody rate="slow">This is slow speech</prosody>
</speak>
```
- Max 8000 characters per response
- Max ~240 seconds of speech per response
- Custom tags like `<chuckle>` must be converted to valid SSML before sending to Alexa

### 3. Alexa-Hosted Skills
- Amazon provides free hosting (Lambda + S3 + CodeCommit)
- Code lives in a **CodeCommit git repo** — push to deploy
- Runtime: Node.js 16.x (hosted) — be careful with modern JS syntax
- Deploy via: console editor OR `git push` to the CodeCommit repo
- The ASK CLI can clone/push to hosted skills: `ask init --hosted-skill-id <id>`

### 4. ASK CLI (Alexa Skills Kit CLI)
```bash
npm install -g ask-cli         # Install
ask configure                   # Link Amazon account
ask smapi list-skills-for-vendor  # List your skills
ask smapi simulate-skill --skill-id <id> --device-locale en-US --input-content "open story time"
ask init --hosted-skill-id <id>   # Clone hosted skill repo
```
- `ask smapi` — direct API calls to Alexa service
- `ask deploy` — deploy skill package + Lambda (self-hosted only)
- For hosted skills, use `git push` instead of `ask deploy`

### 5. Multi-Language Support
- Alexa supports multiple locales per skill (en-IN, en-US, hi-IN, etc.)
- Each locale needs its own interaction model with localized utterances
- The Lambda handler detects locale from `request.locale` and switches language
- Hindi invocation name: "कहानी टाइम" (must be in Devanagari)

### 6. Story Format with Effect Tags
We invented a simple markup for stories:
```
Once upon a time… there was Leo. <chuckle> He loved playing.
<gasp> The sun set… <sniffle> "I'm lost," he whispered.
```
The SSML builder converts these to Alexa-compatible SSML:
- `<chuckle>` → `<say-as interpret-as="interjection">tee hee</say-as>`
- `<gasp>` → `<say-as interpret-as="interjection">oh my</say-as>`
- `<sniffle>` → `<break time="500ms"/>`
- `<sigh>` → `<say-as interpret-as="interjection">ah</say-as>`
- `…` → `<break time="600ms"/>`

### 7. Testing
- **Unit tests**: Test SSML conversion, story lookup independently
- **Handler tests**: Simulate Alexa requests with mock events
- **Console simulator**: Test tab in Alexa Developer Console
- **CLI simulator**: `ask smapi simulate-skill` for automated testing
- Lambda callback pattern: `handler(event, context, callback)`

---

## Gotchas & Lessons

1. **Console code editor is unreliable** — editing via the Ace editor API (JavaScript) corrupts files due to string escaping layers. Use `git push` instead.

2. **Alexa-hosted skills use CodeCommit** — not regular GitHub. The ASK CLI provides git credential helpers to push code.

3. **Spread operator `{...obj}` works in Node 16** but the Ace editor's linter flags it as an error. Use `Object.assign()` if you want to avoid warnings in the console.

4. **SSML must be valid XML** — unclosed tags, special characters (`&`, `<`, `>` in text) will crash the skill.

5. **Session attributes reset per session** — language preference doesn't persist across sessions. Use DynamoDB for persistence (Phase 2).

6. **8000 char SSML limit** — long stories must be split into parts. Our `toSsmlParts()` handles this automatically.

7. **Interaction model must be saved per locale** — updating en-IN doesn't auto-update en-US unless "Sync locales" is enabled.

---

## Project Structure
```
alexa-story-plugin/
├── src/                    # Source (development)
│   ├── handler.js          # Main Lambda handler
│   ├── stories.js          # Story content (en + hi)
│   ├── utils/ssml.js       # SSML builder
│   ├── interactionModel.json      # English interaction model
│   ├── interactionModel.hi.json   # Hindi interaction model
│   └── skill.json          # Skill manifest
├── lambda/                 # Alexa-hosted deployment copy
│   ├── index.js            # Handler (copied from src)
│   ├── stories.js
│   ├── ssml.js
│   └── package.json
├── skill-package/          # ASK CLI skill package
│   └── interactionModels/custom/
│       ├── en-IN.json
│       ├── en-US.json
│       └── hi-IN.json
├── test/run-tests.js       # 33 tests
├── template.yaml           # SAM template (self-hosted deploy)
└── LEARNING.md             # This file
```

---

## Phase 2 Roadmap
- [ ] MP3 audio playback via AudioPlayer directives
- [ ] DynamoDB for persistent user preferences
- [ ] Admin API for uploading new stories
- [ ] More stories in both languages
- [ ] Marketplace submission

---

## Useful Links
- [Alexa Skills Kit Docs](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html)
- [SSML Reference](https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html)
- [ASK CLI Reference](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-command-reference.html)
- [Alexa Skill Certification](https://developer.amazon.com/en-US/docs/alexa/custom-skills/certification-requirements-for-custom-skills.html)
