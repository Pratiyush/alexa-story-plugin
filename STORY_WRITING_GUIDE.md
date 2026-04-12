# Story Writing Guide — Alexa Story Time

## SSML Quick Reference

### Effect Tags (Our Custom Format)
These tags in story content get auto-converted to Alexa SSML:

| Tag | Effect | When to Use |
|-----|--------|-------------|
| `<chuckle>` | Light laugh interjection | Humor, warmth, amusement |
| `<gasp>` | Surprise interjection | Shock, revelation, wonder |
| `<sniffle>` | Sad pause | Sadness, tears, emotional moments |
| `<sigh>` | Relief/weariness interjection | Relief, tiredness, resignation |
| `…` (ellipsis) | 600ms dramatic pause | Suspense, scene transitions |
| `\n\n` | 800ms paragraph pause | Between scenes/paragraphs |

### Alexa SSML Features (Advanced — for Phase 2)

```xml
<!-- Whisper for secrets/suspense -->
<amazon:effect name="whispered">I know where the treasure is.</amazon:effect>

<!-- Prosody for voice modulation -->
<prosody rate="slow" pitch="low" volume="soft">The forest grew darker...</prosody>

<!-- Emotions (only with default voice, not with <voice> tag) -->
<amazon:emotion name="excited" intensity="medium">You found the golden key!</amazon:emotion>
<amazon:emotion name="disappointed" intensity="low">Oh no, the bridge is broken.</amazon:emotion>

<!-- Sound effects from Alexa Sound Library -->
<audio src="soundbank://soundlibrary/animals/amzn_sfx_bear_groan_roar_01"/>
<audio src="soundbank://soundlibrary/nature/amzn_sfx_thunder_rumble_01"/>

<!-- Character voices (Amazon Polly) -->
<voice name="Matthew"><prosody pitch="low">Who dares enter?</prosody></voice>

<!-- Speechcons (expressive interjections) -->
<say-as interpret-as="interjection">abracadabra</say-as>
<say-as interpret-as="interjection">bazinga</say-as>
```

### Bilingual Voices
- **Aditi** — bilingual neural voice (en-IN + hi-IN), can switch mid-sentence
- **Kajal** — newer bilingual neural voice (en-IN + hi-IN)

---

## Story Writing Rules

### Structure
1. **Opening** — Set the scene (15-20 sec). Use `…` for atmospheric pauses
2. **Rising action** — Build tension with `<gasp>`, `<sigh>`, shorter sentences
3. **Climax** — Peak moment with `<gasp>`, dialogue, and dramatic pauses
4. **Resolution** — Satisfying ending with `<chuckle>` or `<sigh>`
5. **Moral** — Optional closing lesson (1-2 sentences)

### Pacing
- Keep each speech segment **under 30 seconds** before a natural pause
- Use `…` between phrases for breath-like pauses
- Use `\n\n` between paragraphs for scene transitions
- Dialogue should feel natural — short exchanges, not monologues
- Apply the **"one-breath test"** — if you can't read it in one breath, add a pause

### Length
- **Target**: 3-5 minutes per story (fits in one Alexa response under 8000 chars SSML)
- **Max raw text**: ~1500 characters (expands to ~3500-4000 with SSML tags)
- If longer, the `toSsmlParts()` function auto-splits at paragraph boundaries

### Effect Tag Usage
- **Don't overuse** — 8-12 effect tags per story is ideal
- **Place after the trigger sentence**, not before:
  - Good: `He saw the tiger. <gasp>`
  - Bad: `<gasp> He saw the tiger.`
- **Pair with pauses** — effect tags already include built-in breaks
- **Match language** — Hindi effects use Hindi interjections automatically

### Dialogue
- Use quotation marks for spoken dialogue: `"Hello," he said.`
- Keep dialogue lines short (under 15 words)
- Alternate between dialogue and narration
- Don't use complex nested quotes

### Hindi Writing
- Write in natural spoken Hindi (Hindustani), not formal/Sanskrit Hindi
- Use common words that Alexa's TTS pronounces well
- Test pronunciation of unusual words
- The `…` and effect tags work identically in Hindi stories

---

## Alexa Platform Limits

| Limit | Value |
|-------|-------|
| SSML per response | 8,000 characters max |
| Speech duration | ~240 seconds max |
| Audio clips per response | 5 max |
| Continuous silence | 10 seconds max |
| Total response size | 24 KB max |

---

## Story Categories for Indian Folklore

| Collection | Style | Typical Length |
|------------|-------|---------------|
| **Panchatantra** | Animal fables with morals | 3-4 min |
| **Akbar-Birbal** | Wit and humor, court setting | 2-3 min |
| **Vikram-Betaal** | Riddle stories with twists | 4-5 min |
| **Tenali Raman** | Clever humor, court pranks | 3-4 min |
| **Jataka Tales** | Buddhist wisdom stories | 3-4 min |
| **Hitopadesha** | Friendship and wisdom fables | 3-4 min |
| **Regional Folklore** | Diverse, cultural flavor | varies |

---

## Template for New Stories

```javascript
{
  id: 'story-slug-here',           // lowercase, hyphenated
  title: 'Story Title Here',       // English title
  category: 'panchatantra',        // collection name
  content:
    'Opening line with atmosphere… setting the scene. <chuckle> Character introduction.\n\n' +
    'Rising action… building tension. <gasp> Something surprising happens.\n\n' +
    '"Dialogue here," the character said. <sniffle> Emotional moment.\n\n' +
    'Climax and resolution… <sigh> The lesson becomes clear.\n\n' +
    'And so… the moral of the story is… wisdom always wins.',
}
```

---

## Certification Checklist

- [ ] All stories are original retellings (not copied from books)
- [ ] Content is family-friendly for all ages
- [ ] No copyrighted material, brand names, or real people
- [ ] No violence, profanity, or inappropriate content
- [ ] Skill handles all intents without crashing
- [ ] Proper error messages and reprompts
- [ ] Help intent provides clear guidance
- [ ] Stop/Cancel cleanly ends the session
- [ ] Tested in all supported locales (en-IN, en-US, hi-IN)
