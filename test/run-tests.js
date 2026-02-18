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

async function testMissingAudioUrlFallback() {
  // When audio_url is missing, handler should speak the fallback message.
  process.env.S3_BUCKET = "example-bucket";
  process.env.LATEST_JSON_KEY = "latest.json";
  process.env.TEST_LATEST_STORY_JSON = JSON.stringify({
    id: "story-2026-02",
    title: "Story Without Audio"
  });

  const handler = AlexaHandler.handler;
  const event = require("./sample-play-latest-intent.json");
  const response = await handler(event, {});

  const ssml = response.response.outputSpeech.ssml;
  if (!ssml.includes("I couldn't find a recording")) {
    throw new Error("Expected missing audio fallback speech");
  }

  delete process.env.TEST_LATEST_STORY_JSON;
}

async function testPlayStoryByNameIntentUsesRequestedName() {
  // Ensure the spoken prefix acknowledges the storyName slot.
  process.env.S3_BUCKET = "example-bucket";
  process.env.LATEST_JSON_KEY = "latest.json";
  process.env.TEST_LATEST_STORY_JSON = JSON.stringify(buildTestStoryPayload());

  const handler = AlexaHandler.handler;
  const baseEvent = require("./sample-play-latest-intent.json");

  const event = {
    ...baseEvent,
    request: {
      ...baseEvent.request,
      intent: {
        name: "PlayStoryByNameIntent",
        confirmationStatus: "NONE",
        slots: {
          storyName: {
            name: "storyName",
            value: "The Brave Little Mouse",
            confirmationStatus: "NONE"
          }
        }
      }
    }
  };

  const response = await handler(event, {});
  const ssml = response.response.outputSpeech.ssml;
  if (!ssml.includes("Playing The Brave Little Mouse")) {
    throw new Error("Expected PlayStoryByName to reference requested storyName");
  }

  delete process.env.TEST_LATEST_STORY_JSON;
}

async function testPauseAndStopIntents() {
  const handler = AlexaHandler.handler;
  const baseEvent = require("./sample-play-latest-intent.json");

  const pauseEvent = {
    ...baseEvent,
    request: {
      ...baseEvent.request,
      intent: {
        name: "AMAZON.PauseIntent",
        confirmationStatus: "NONE"
      }
    }
  };

  const pauseResponse = await handler(pauseEvent, {});
  if (
    !Array.isArray(pauseResponse.response.directives) ||
    pauseResponse.response.directives[0].type !== "AudioPlayer.Stop"
  ) {
    throw new Error("PauseIntent must send AudioPlayer.Stop directive");
  }

  const stopEvent = {
    ...baseEvent,
    request: {
      ...baseEvent.request,
      intent: {
        name: "AMAZON.StopIntent",
        confirmationStatus: "NONE"
      }
    }
  };

  const stopResponse = await handler(stopEvent, {});
  if (!stopResponse.response.outputSpeech.ssml.includes("Goodbye")) {
    throw new Error("StopIntent must say Goodbye");
  }
}

async function testAudioPlayerEventHandlersNoop() {
  const handler = AlexaHandler.handler;

  const playbackStartedEvent = {
    version: "1.0",
    context: {},
    request: {
      type: "AudioPlayer.PlaybackStarted",
      requestId: "req-1",
      locale: "en-US",
      timestamp: new Date().toISOString()
    }
  };

  const playbackFinishedEvent = {
    ...playbackStartedEvent,
    request: {
      ...playbackStartedEvent.request,
      type: "AudioPlayer.PlaybackFinished"
    }
  };

  const playbackStoppedEvent = {
    ...playbackStartedEvent,
    request: {
      ...playbackStartedEvent.request,
      type: "AudioPlayer.PlaybackStopped"
    }
  };

  await handler(playbackStartedEvent, {});
  await handler(playbackFinishedEvent, {});
  await handler(playbackStoppedEvent, {});
}

async function run() {
  try {
    await testFetchLatestStoryOverride();
    await testPlayLatestIntentAudioDirective();
    await testLaunchRequestDelegatesToPlayLatest();
    await testRepeatOneUsesAudioPlayerToken();
    await testHelpAndFallbackSpeech();
    await testMissingAudioUrlFallback();
    await testPlayStoryByNameIntentUsesRequestedName();
    await testPauseAndStopIntents();
    await testAudioPlayerEventHandlersNoop();
    process.exit(0);
  } catch (error) {
    console.error("Test run failed", error);
    process.exit(1);
  }
}
run();
