/**
 * SSML builder — converts story text with custom effect tags into
 * Alexa-compatible SSML for expressive text-to-speech narration.
 *
 * Custom tags supported in story content:
 *   <chuckle>   → light laugh / amusement
 *   <gasp>      → surprise / shock
 *   <sniffle>   → sadness / tears
 *   <sigh>      → relief / weariness
 *   … or ...    → dramatic pause
 */

// ---------------------------------------------------------------------------
// Effect mappings per language
// ---------------------------------------------------------------------------

const EFFECTS_EN = {
  '<chuckle>': '<break time="300ms"/><say-as interpret-as="interjection">tee hee</say-as><break time="300ms"/>',
  '<gasp>': '<break time="200ms"/><say-as interpret-as="interjection">oh my</say-as><break time="400ms"/>',
  '<sniffle>': '<break time="500ms"/>',
  '<sigh>': '<break time="300ms"/><say-as interpret-as="interjection">ah</say-as><break time="300ms"/>',
};

const EFFECTS_HI = {
  '<chuckle>': '<break time="300ms"/><say-as interpret-as="interjection">हीही</say-as><break time="300ms"/>',
  '<gasp>': '<break time="200ms"/><say-as interpret-as="interjection">अरे</say-as><break time="400ms"/>',
  '<sniffle>': '<break time="500ms"/>',
  '<sigh>': '<break time="300ms"/><say-as interpret-as="interjection">आह</say-as><break time="300ms"/>',
};

const EFFECTS_BY_LANG = {
  en: EFFECTS_EN,
  hi: EFFECTS_HI,
};

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

/**
 * Convert raw story content to Alexa SSML.
 *
 * @param {string} content  – story text with custom effect tags
 * @param {'en'|'hi'} lang  – language code
 * @returns {string} complete SSML string wrapped in <speak>
 */
function toSsml(content, lang = 'en') {
  const effects = EFFECTS_BY_LANG[lang] || EFFECTS_EN;
  let ssml = content;

  // 1. Replace custom effect tags
  for (const [tag, replacement] of Object.entries(effects)) {
    ssml = ssml.split(tag).join(replacement);
  }

  // 2. Replace ellipsis characters and triple-dots with dramatic pauses
  ssml = ssml.replace(/…/g, '<break time="600ms"/>');
  ssml = ssml.replace(/\.{3}/g, '<break time="600ms"/>');

  // 3. Replace paragraph breaks (double newline) with longer pauses
  ssml = ssml.replace(/\n\n/g, '<break time="800ms"/> ');

  // 4. Replace single newlines with short pauses
  ssml = ssml.replace(/\n/g, '<break time="300ms"/> ');

  // 5. Wrap in <speak> tags
  ssml = `<speak>${ssml}</speak>`;

  return ssml;
}

/**
 * Split SSML content into parts if it exceeds Alexa's 8000-character limit.
 * Each part is a complete <speak>…</speak> block.
 *
 * @param {string} content – raw story content (before SSML conversion)
 * @param {'en'|'hi'} lang
 * @param {number} maxChars – per-part character limit (default 7500 to leave margin)
 * @returns {string[]} array of SSML strings
 */
function toSsmlParts(content, lang = 'en', maxChars = 7500) {
  const full = toSsml(content, lang);

  // If it fits in one response, return as-is
  if (full.length <= maxChars) {
    return [full];
  }

  // Split on paragraph pauses and rebuild parts
  const paragraphs = content.split('\n\n');
  const parts = [];
  let currentPart = '';

  for (const para of paragraphs) {
    const candidate = currentPart ? currentPart + '\n\n' + para : para;
    const candidateSsml = toSsml(candidate, lang);

    if (candidateSsml.length > maxChars && currentPart) {
      parts.push(toSsml(currentPart, lang));
      currentPart = para;
    } else {
      currentPart = candidate;
    }
  }

  if (currentPart) {
    parts.push(toSsml(currentPart, lang));
  }

  return parts;
}

module.exports = { toSsml, toSsmlParts };
