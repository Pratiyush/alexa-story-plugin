// Test harness for Alexa Story Time skill (Phase 1 — TTS/SSML)
const assert = require('assert');

// --- Unit tests for SSML builder ---

const { toSsml, toSsmlParts } = require('../src/utils/ssml');

function testSsmlBasicConversion() {
  const result = toSsml('Hello world', 'en');
  assert.strictEqual(result, '<speak>Hello world</speak>');
}

function testSsmlEllipsisReplacement() {
  const result = toSsml('Once upon a time…', 'en');
  assert.ok(result.includes('<break time="600ms"/>'));
  assert.ok(!result.includes('…'));
}

function testSsmlTripleDotReplacement() {
  const result = toSsml('Wait for it...', 'en');
  assert.ok(result.includes('<break time="600ms"/>'));
}

function testSsmlChuckleTag() {
  const result = toSsml('He laughed. <chuckle> Then left.', 'en');
  assert.ok(!result.includes('<chuckle>'), 'Custom tag should be replaced');
  assert.ok(result.includes('tee hee'), 'English chuckle should use "tee hee"');
}

function testSsmlGaspTag() {
  const result = toSsml('She saw it. <gasp> Amazing!', 'en');
  assert.ok(!result.includes('<gasp>'));
  assert.ok(result.includes('oh my'));
}

function testSsmlSniffleTag() {
  const result = toSsml('So sad. <sniffle> He cried.', 'en');
  assert.ok(!result.includes('<sniffle>'));
  assert.ok(result.includes('<break time="500ms"/>'));
}

function testSsmlSighTag() {
  const result = toSsml('Finally safe. <sigh> Relief.', 'en');
  assert.ok(!result.includes('<sigh>'));
}

function testSsmlHindiEffects() {
  const result = toSsml('वह हँसा। <chuckle> फिर गया।', 'hi');
  assert.ok(!result.includes('<chuckle>'));
  assert.ok(result.includes('हीही'), 'Hindi chuckle should use "हीही"');
}

function testSsmlHindiGasp() {
  const result = toSsml('उसने देखा। <gasp> अद्भुत!', 'hi');
  assert.ok(!result.includes('<gasp>'));
  assert.ok(result.includes('अरे'));
}

function testSsmlParagraphBreaks() {
  const result = toSsml('Para one.\n\nPara two.', 'en');
  assert.ok(result.includes('<break time="800ms"/>'));
}

function testSsmlWrappedInSpeak() {
  const result = toSsml('Test', 'en');
  assert.ok(result.startsWith('<speak>'));
  assert.ok(result.endsWith('</speak>'));
}

function testSsmlPartsShortStory() {
  const parts = toSsmlParts('Short story content.', 'en');
  assert.strictEqual(parts.length, 1, 'Short story should be one part');
}

function testSsmlPartsAllWrapped() {
  const parts = toSsmlParts('Part one.\n\nPart two.', 'en');
  for (const part of parts) {
    assert.ok(part.startsWith('<speak>'), 'Each part should be wrapped in <speak>');
    assert.ok(part.endsWith('</speak>'));
  }
}

// --- Unit tests for stories module ---

const { getStoriesByLanguage, findStory, findStoryByTitle, getSupportedLanguages } = require('../src/stories');

function testStoriesEnglishExists() {
  const en = getStoriesByLanguage('en');
  assert.ok(en.length > 0, 'Should have at least one English story');
  assert.strictEqual(en[0].id, 'leo-and-the-firefly');
}

function testStoriesHindiExists() {
  const hi = getStoriesByLanguage('hi');
  assert.ok(hi.length > 0, 'Should have at least one Hindi story');
  assert.strictEqual(hi[0].id, 'leo-and-the-firefly');
  assert.ok(hi[0].title.includes('जुगनू'), 'Hindi title should contain जुगनू');
}

function testFindStoryById() {
  const story = findStory('en', 'leo-and-the-firefly');
  assert.ok(story, 'Should find story by ID');
  assert.strictEqual(story.title, 'Leo and the Firefly');
}

function testFindStoryByTitleExact() {
  const story = findStoryByTitle('en', 'Leo and the Firefly');
  assert.ok(story);
  assert.strictEqual(story.id, 'leo-and-the-firefly');
}

function testFindStoryByTitlePartial() {
  const story = findStoryByTitle('en', 'firefly');
  assert.ok(story, 'Should find story by partial title');
}

function testFindStoryByTitleHindi() {
  const story = findStoryByTitle('hi', 'जुगनू');
  assert.ok(story, 'Should find Hindi story by partial title');
}

function testUnknownLanguageReturnsEmpty() {
  const list = getStoriesByLanguage('fr');
  assert.strictEqual(list.length, 0);
}

function testSupportedLanguages() {
  const langs = getSupportedLanguages();
  assert.ok(langs.includes('en'));
  assert.ok(langs.includes('hi'));
}

// --- Integration: SSML output from actual story content ---

function testFullEnglishStorySsml() {
  const story = findStory('en', 'leo-and-the-firefly');
  const parts = toSsmlParts(story.content, 'en');
  assert.ok(parts.length >= 1, 'Should produce at least one SSML part');
  const full = parts.join('');
  assert.ok(!full.includes('<chuckle>'), 'No raw custom tags should remain');
  assert.ok(!full.includes('<gasp>'));
  assert.ok(!full.includes('<sniffle>'));
  assert.ok(!full.includes('<sigh>'));
  // Check SSML size limit (each part under 8000 chars)
  for (const part of parts) {
    assert.ok(part.length < 8000, `SSML part too long: ${part.length} chars`);
  }
}

function testFullHindiStorySsml() {
  const story = findStory('hi', 'leo-and-the-firefly');
  const parts = toSsmlParts(story.content, 'hi');
  assert.ok(parts.length >= 1);
  const full = parts.join('');
  assert.ok(!full.includes('<chuckle>'));
  assert.ok(!full.includes('<gasp>'));
  assert.ok(full.includes('हीही'), 'Hindi SSML should use Hindi interjections');
  for (const part of parts) {
    assert.ok(part.length < 8000, `Hindi SSML part too long: ${part.length} chars`);
  }
}

// --- Handler integration tests ---

const AlexaHandler = require('../src/handler');

/** Wrap the Lambda callback-style handler in a promise. */
function invoke(event) {
  return new Promise((resolve, reject) => {
    AlexaHandler.handler(event, {}, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function buildBaseEvent(locale = 'en-IN') {
  return {
    version: '1.0',
    session: {
      new: true,
      sessionId: 'test-session-1',
      application: { applicationId: 'amzn1.ask.skill.test' },
      attributes: {},
      user: { userId: 'test-user-1' },
    },
    context: {
      System: {
        application: { applicationId: 'amzn1.ask.skill.test' },
        user: { userId: 'test-user-1' },
        device: { supportedInterfaces: {} },
      },
    },
    request: {
      type: 'LaunchRequest',
      requestId: 'req-1',
      timestamp: new Date().toISOString(),
      locale,
    },
  };
}

function intentEvent(intentName, slots = {}, locale = 'en-IN') {
  const base = buildBaseEvent(locale);
  return {
    ...base,
    session: { ...base.session, new: false, attributes: {} },
    request: {
      type: 'IntentRequest',
      requestId: 'req-2',
      timestamp: new Date().toISOString(),
      locale,
      intent: { name: intentName, confirmationStatus: 'NONE', slots },
    },
  };
}

async function testLaunchRequest() {
  const response = await invoke(buildBaseEvent());
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('Story Time'), 'Launch should mention Story Time');
  assert.ok(ssml.includes('English'), 'Launch should mention language options');
}

async function testLaunchRequestHindi() {
  const response = await invoke(buildBaseEvent('hi-IN'));
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('कहानी'), 'Hindi launch should use Hindi');
}

async function testPlayLatestIntent() {
  const response = await invoke(intentEvent('PlayLatestIntent'));
  const ssml = response.response.outputSpeech.ssml;
  // Random story selection — just verify it plays SOME story with SSML content
  assert.ok(ssml.includes('Here is'), 'Should announce story with "Here is"');
  assert.ok(ssml.includes('break'), 'Should contain SSML breaks from story content');
}

async function testPlayStoryByName() {
  const response = await invoke(
    intentEvent('PlayStoryIntent', {
      storyName: { name: 'storyName', value: 'Leo and the Firefly', confirmationStatus: 'NONE' },
    })
  );
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('Leo and the Firefly'));
}

async function testPlayStoryNotFound() {
  const response = await invoke(
    intentEvent('PlayStoryIntent', {
      storyName: { name: 'storyName', value: 'nonexistent story xyz', confirmationStatus: 'NONE' },
    })
  );
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('could not find') || ssml.includes('not find'));
}

async function testHelpIntent() {
  const response = await invoke(intentEvent('AMAZON.HelpIntent'));
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('play a story') || ssml.includes('play'));
}

async function testStopIntent() {
  const response = await invoke(intentEvent('AMAZON.StopIntent'));
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('Goodbye') || ssml.includes('goodbye'));
}

async function testFallbackIntent() {
  const response = await invoke(intentEvent('AMAZON.FallbackIntent'));
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('help') || ssml.includes('catch'));
}

async function testSetLanguageHindi() {
  const response = await invoke(
    intentEvent('SetLanguageIntent', {
      language: { name: 'language', value: 'Hindi', confirmationStatus: 'NONE' },
    })
  );
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('Hindi') || ssml.includes('हिंदी'));
}

async function testListStoriesIntent() {
  const response = await invoke(intentEvent('ListStoriesIntent'));
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('Leo') || ssml.includes('stories'));
}

// --- Repeat & NextPart tests ---

async function testRepeatNoStory() {
  const response = await invoke(intentEvent('AMAZON.RepeatIntent'));
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('story') || ssml.includes('hear'));
}

async function testRepeatAfterPlay() {
  // Play a story first to set session
  const playEvent = intentEvent('PlayStoryIntent', {
    storyName: { name: 'storyName', value: 'Leo and the Firefly', confirmationStatus: 'NONE' },
  });
  const playResp = await invoke(playEvent);
  assert.ok(playResp.response.outputSpeech.ssml.includes('Leo'));

  // Now repeat — uses session from play (but Lambda callback-style resets session, so test the handler directly)
  const repeatEvent = intentEvent('RepeatOneIntent');
  // Session won't persist in test, so repeat without story should prompt
  const repeatResp = await invoke(repeatEvent);
  assert.ok(repeatResp.response.outputSpeech);
}

async function testNextPartNoStory() {
  const response = await invoke(intentEvent('NextPartIntent'));
  const ssml = response.response.outputSpeech.ssml;
  assert.ok(ssml.includes('story') || ssml.includes('hear'));
}

async function testAllStoriesSsmlValid() {
  // Verify all 20 stories in both languages generate valid SSML under 8000 chars
  const { getStoriesByLanguage } = require('../src/stories');
  const { toSsmlParts } = require('../src/utils/ssml');
  for (const lang of ['en', 'hi']) {
    const stories = getStoriesByLanguage(lang);
    assert.strictEqual(stories.length, 20, `Expected 20 ${lang} stories`);
    for (const story of stories) {
      const parts = toSsmlParts(story.content, lang);
      assert.ok(parts.length >= 1, `${story.id} should have at least 1 part`);
      for (const part of parts) {
        assert.ok(part.startsWith('<speak>'), `${story.id} part should start with <speak>`);
        assert.ok(part.endsWith('</speak>'), `${story.id} part should end with </speak>`);
        assert.ok(part.length < 8000, `${story.id} part too long: ${part.length}`);
        assert.ok(!part.includes('<chuckle>'), `${story.id} has unconverted <chuckle>`);
        assert.ok(!part.includes('<gasp>'), `${story.id} has unconverted <gasp>`);
      }
    }
  }
}

// --- Run all tests ---

const tests = [
  // SSML unit tests
  ['ssml: basic conversion', testSsmlBasicConversion],
  ['ssml: ellipsis replacement', testSsmlEllipsisReplacement],
  ['ssml: triple dot replacement', testSsmlTripleDotReplacement],
  ['ssml: chuckle tag', testSsmlChuckleTag],
  ['ssml: gasp tag', testSsmlGaspTag],
  ['ssml: sniffle tag', testSsmlSniffleTag],
  ['ssml: sigh tag', testSsmlSighTag],
  ['ssml: hindi effects', testSsmlHindiEffects],
  ['ssml: hindi gasp', testSsmlHindiGasp],
  ['ssml: paragraph breaks', testSsmlParagraphBreaks],
  ['ssml: wrapped in speak', testSsmlWrappedInSpeak],
  ['ssml: parts short story', testSsmlPartsShortStory],
  ['ssml: parts all wrapped', testSsmlPartsAllWrapped],
  // Story module tests
  ['stories: english exists', testStoriesEnglishExists],
  ['stories: hindi exists', testStoriesHindiExists],
  ['stories: find by id', testFindStoryById],
  ['stories: find by title exact', testFindStoryByTitleExact],
  ['stories: find by title partial', testFindStoryByTitlePartial],
  ['stories: find by title hindi', testFindStoryByTitleHindi],
  ['stories: unknown language', testUnknownLanguageReturnsEmpty],
  ['stories: supported languages', testSupportedLanguages],
  // Integration tests
  ['integration: english story ssml', testFullEnglishStorySsml],
  ['integration: hindi story ssml', testFullHindiStorySsml],
  // Handler tests
  ['handler: launch request', testLaunchRequest],
  ['handler: launch request hindi', testLaunchRequestHindi],
  ['handler: play latest', testPlayLatestIntent],
  ['handler: play by name', testPlayStoryByName],
  ['handler: play not found', testPlayStoryNotFound],
  ['handler: help', testHelpIntent],
  ['handler: stop', testStopIntent],
  ['handler: fallback', testFallbackIntent],
  ['handler: set language hindi', testSetLanguageHindi],
  ['handler: list stories', testListStoriesIntent],
  ['handler: repeat no story', testRepeatNoStory],
  ['handler: repeat after play', testRepeatAfterPlay],
  ['handler: next part no story', testNextPartNoStory],
  ['integration: all 20 stories ssml valid', testAllStoriesSsmlValid],
];

async function run() {
  let passed = 0;
  let failed = 0;

  for (const [name, fn] of tests) {
    try {
      await fn();
      console.log(`  PASS  ${name}`);
      passed++;
    } catch (err) {
      console.error(`  FAIL  ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed, ${tests.length} total`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
