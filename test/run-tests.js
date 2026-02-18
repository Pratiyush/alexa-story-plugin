// Minimal test harness using Node's assert module.
const assert = require("assert");
const { fetchLatestStory } = require("../src/utils/s3Client");
const AlexaHandler = require("../src/handler");

function buildTestStoryPayload() {
  return {
    id: "story-2026-01",
    title: "The Brave Little Mouse",
    audio_url: "https://your-cdn-url/story-2026-01.mp3"
  };
}

async function testFetchLatestStoryOverride() {
  // Verify that TEST_LATEST_STORY_JSON shortcut is respected.
  process.env.TEST_LATEST_STORY_JSON = JSON.stringify(buildTestStoryPayload());
  const story = await fetchLatestStory("ignored-bucket", "ignored-key");
  assert.strictEqual(story.id, "story-2026-01");
  assert.strictEqual(
    story.audio_url,
    "https://your-cdn-url/story-2026-01.mp3"
  );
  delete process.env.TEST_LATEST_STORY_JSON;
}

async function testPlayLatestIntentAudioDirective() {
  process.env.S3_BUCKET = "example-bucket";
  process.env.LATEST_JSON_KEY = "latest.json";
  process.env.TEST_LATEST_STORY_JSON = JSON.stringify(buildTestStoryPayload());

  const handler = AlexaHandler.handler;
  const event = require("./sample-play-latest-intent.json");
  const context = {};
  const response = await handler(event, context);

  assert.ok(response);
  const directives = response.response.directives;
  assert.ok(Array.isArray(directives));
  assert.ok(directives.length > 0);
  const playDirective = directives[0];
  assert.strictEqual(playDirective.type, "AudioPlayer.Play");
  assert.strictEqual(playDirective.playBehavior, "REPLACE_ALL");
  assert.strictEqual(
    playDirective.audioItem.stream.url,
    "https://your-cdn-url/story-2026-01.mp3"
  );

  delete process.env.TEST_LATEST_STORY_JSON;
}

async function testLaunchRequestDelegatesToPlayLatest() {
  process.env.S3_BUCKET = "example-bucket";
  process.env.LATEST_JSON_KEY = "latest.json";
  process.env.TEST_LATEST_STORY_JSON = JSON.stringify(buildTestStoryPayload());

  const handler = AlexaHandler.handler;
  const event = require("./sample-launch-request.json");
  const context = {};
  const response = await handler(event, context);

  assert.ok(response);
  const directives = response.response.directives;
  assert.ok(Array.isArray(directives));
  assert.strictEqual(directives[0].type, "AudioPlayer.Play");

  delete process.env.TEST_LATEST_STORY_JSON;
}

async function testRepeatOneUsesAudioPlayerToken() {
  process.env.S3_BUCKET = "example-bucket";
  process.env.LATEST_JSON_KEY = "latest.json";
  process.env.TEST_LATEST_STORY_JSON = JSON.stringify(buildTestStoryPayload());

  const handler = AlexaHandler.handler;
  const baseEvent = require("./sample-play-latest-intent.json");

  const repeatEvent = {
    ...baseEvent,
    request: {
      ...baseEvent.request,
      type: "IntentRequest",
      intent: {
        name: "RepeatOneIntent",
        confirmationStatus: "NONE"
      }
    },
    context: {
      ...baseEvent.context,
      AudioPlayer: {
        token: "story-2026-01",
        offsetInMilliseconds: 0,
        playerActivity: "FINISHED"
      }
    }
  };

  const response = await handler(repeatEvent, {});
  const directives = response.response.directives;
  assert.ok(Array.isArray(directives));
  const playDirective = directives[0];
  assert.strictEqual(playDirective.type, "AudioPlayer.Play");
  assert.strictEqual(playDirective.audioItem.stream.token, "story-2026-01");

  delete process.env.TEST_LATEST_STORY_JSON;
}

async function testHelpAndFallbackSpeech() {
  const handler = AlexaHandler.handler;

  const helpEvent = {
    ...require("./sample-play-latest-intent.json"),
    request: {
      ...require("./sample-play-latest-intent.json").request,
      intent: {
        name: "AMAZON.HelpIntent",
        confirmationStatus: "NONE"
      }
    }
  };

  const helpResponse = await handler(helpEvent, {});
  assert.ok(
    helpResponse.response.outputSpeech.ssml.includes("play latest story")
  );

  const fallbackEvent = {
    ...require("./sample-play-latest-intent.json"),
    request: {
      ...require("./sample-play-latest-intent.json").request,
      intent: {
        name: "AMAZON.FallbackIntent",
        confirmationStatus: "NONE"
      }
    }
  };

  const fallbackResponse = await handler(fallbackEvent, {});
  assert.ok(
    fallbackResponse.response.outputSpeech.ssml.includes(
      "You can say play latest story"
    )
  );
}

async function run() {
  await testFetchLatestStoryOverride();
  await testPlayLatestIntentAudioDirective();
  await testLaunchRequestDelegatesToPlayLatest();
  await testRepeatOneUsesAudioPlayerToken();
  await testHelpAndFallbackSpeech();
  process.exit(0);
}

run().catch(() => {
  process.exit(1);
});
