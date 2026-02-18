// Main Alexa skill entry point and intent handlers. This Lambda is invoked by
// the Alexa custom skill and is responsible for mapping user utterances onto
// AudioPlayer directives that stream the latest approved story.
const Alexa = require("ask-sdk-core");
const { fetchLatestStory } = require("./utils/s3Client");

// LaunchRequest: "open Story Player" routes to playing the latest story.
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
  },
  async handle(handlerInput) {
    return PlayLatestIntentHandler.handle(handlerInput);
  }
};

// PlayLatestIntent: fetch latest.json from S3 and stream the newest story. This
// is the central path used both for direct PlayLatestIntent utterances and
// when the user simply opens the skill.
const PlayLatestIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return requestType === "IntentRequest" && intentName === "PlayLatestIntent";
  },
  async handle(handlerInput) {
    const bucket = process.env.S3_BUCKET;
    const key = process.env.LATEST_JSON_KEY || "latest.json";

    let latest;
    try {
      latest = await fetchLatestStory(bucket, key);
    } catch {
      const speakOutput = "I could not reach the latest story feed. Please try again later.";
      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }

    if (!latest || !latest.audio_url) {
      const speakOutput =
        "I couldn't find a recording. Would you like me to read it instead?";
      return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }

    const title = latest.title || "Latest story";
    const token = latest.id || "latest-story";
    const audioUrl = latest.audio_url;

    const playBehavior = "REPLACE_ALL";

    return handlerInput.responseBuilder
      .speak(`Playing ${title}`)
      .addAudioPlayerPlayDirective(playBehavior, audioUrl, token, 0, null, {
        title,
        art: {
          sources: []
        }
      })
      .getResponse();
  }
};

// PlayStoryByNameIntent: the current implementation still plays the latest
// story, but changes the spoken prefix to include the requested storyName so
// that users hear the name they asked for.
const PlayStoryByNameIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return requestType === "IntentRequest" && intentName === "PlayStoryByNameIntent";
  },
  async handle(handlerInput) {
    const bucket = process.env.S3_BUCKET;
    const key = process.env.LATEST_JSON_KEY || "latest.json";

    let latest;
    try {
      latest = await fetchLatestStory(bucket, key);
    } catch {
      const speakOutput = "I could not reach the latest story feed. Please try again later.";
      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }

    const requestedName =
      Alexa.getSlotValue(handlerInput.requestEnvelope, "storyName") || "";

    const title = latest.title || "Latest story";
    const token = latest.id || "latest-story";
    const audioUrl = latest.audio_url;

    if (!audioUrl) {
      const speakOutput =
        "I couldn't find a recording. Would you like me to read it instead?";
      return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }

    const speakPrefix = requestedName
      ? `Playing ${requestedName}`
      : `Playing ${title}`;
    const playBehavior = "REPLACE_ALL";

    return handlerInput.responseBuilder
      .speak(speakPrefix)
      .addAudioPlayerPlayDirective(playBehavior, audioUrl, token, 0, null, {
        title,
        art: {
          sources: []
        }
      })
      .getResponse();
  }
};

// RepeatOneIntent: replay the last story using the AudioPlayer token. The
// token is supplied by Alexa on AudioPlayer events and in the playback
// context for subsequent requests.
const RepeatOneIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return requestType === "IntentRequest" && intentName === "RepeatOneIntent";
  },
  async handle(handlerInput) {
    const bucket = process.env.S3_BUCKET;
    const key = process.env.LATEST_JSON_KEY || "latest.json";

    let latest;
    try {
      latest = await fetchLatestStory(bucket, key);
    } catch {
      const speakOutput = "I could not reach the latest story feed. Please try again later.";
      return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }

    if (!latest || !latest.audio_url) {
      const speakOutput =
        "I couldn't find a recording. Would you like me to read it instead?";
      return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }

    const audioPlayer = handlerInput.requestEnvelope.context
      ? handlerInput.requestEnvelope.context.AudioPlayer
      : null;
    const lastToken = audioPlayer && audioPlayer.token ? audioPlayer.token : null;

    const title = latest.title || "Latest story";
    const token = lastToken || latest.id || "latest-story";
    const audioUrl = latest.audio_url;
    const playBehavior = "REPLACE_ALL";

    return handlerInput.responseBuilder
      .speak(`Replaying ${title}`)
      .addAudioPlayerPlayDirective(playBehavior, audioUrl, token, 0, null, {
        title,
        art: {
          sources: []
        }
      })
      .getResponse();
  }
};

// HelpIntent: explain supported phrases.
const HelpIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return (
      requestType === "IntentRequest" &&
      intentName === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "You can say play latest story, play newest story, or play story by name.";

    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
  }
};

// Stop and Cancel: stop playback and end the session.
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return (
      requestType === "IntentRequest" &&
      (intentName === "AMAZON.CancelIntent" ||
        intentName === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Goodbye.")
      .addAudioPlayerStopDirective()
      .getResponse();
  }
};

// PauseIntent: pause playback without extra speech.
const PauseIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return (
      requestType === "IntentRequest" &&
      intentName === "AMAZON.PauseIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .getResponse();
  }
};

// ResumeIntent: delegate to repeat-one logic to replay the story.
const ResumeIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return (
      requestType === "IntentRequest" &&
      intentName === "AMAZON.ResumeIntent"
    );
  },
  async handle(handlerInput) {
    return RepeatOneIntentHandler.handle(handlerInput);
  }
};

// FallbackIntent: catch unsupported utterances and guide the user.
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return (
      requestType === "IntentRequest" &&
      intentName === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "I did not understand that. You can say play latest story.";
    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
  }
};

// SessionEndedRequest: cleanly end the session.
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

// AudioPlayer events: no-op handlers required for AudioPlayer interface.
const PlaybackStartedHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "AudioPlayer.PlaybackStarted"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

const PlaybackFinishedHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "AudioPlayer.PlaybackFinished"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

const PlaybackStoppedHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "AudioPlayer.PlaybackStopped"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

// Catch-all error handler to return a generic apology.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    const speakOutput = "Sorry, something went wrong.";
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayLatestIntentHandler,
    PlayStoryByNameIntentHandler,
    RepeatOneIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    PlaybackStartedHandler,
    PlaybackFinishedHandler,
    PlaybackStoppedHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
