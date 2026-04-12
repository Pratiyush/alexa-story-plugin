/**
 * Alexa Story Player — Lambda handler
 *
 * Phase 1: Text-to-speech storytelling with SSML effects.
 *          Stories are bundled in src/stories.js.
 *          Supports English (en) and Hindi (hi).
 *
 * Phase 2 (future): MP3 audio playback via AudioPlayer directives.
 */

const Alexa = require('ask-sdk-core');
const { getStoriesByLanguage, findStory, findStoryByTitle } = require('./stories');
const { toSsmlParts } = require('./utils/ssml');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLang(handlerInput) {
  const sessionLang = handlerInput.attributesManager.getSessionAttributes().language;
  if (sessionLang) return sessionLang;
  const locale = handlerInput.requestEnvelope.request.locale || 'en-IN';
  return locale.startsWith('hi') ? 'hi' : 'en';
}

function setSession(handlerInput, attrs) {
  const current = handlerInput.attributesManager.getSessionAttributes();
  handlerInput.attributesManager.setSessionAttributes(Object.assign({}, current, attrs));
}

/** Pick a random story from the list. */
function pickRandomStory(lang) {
  const list = getStoriesByLanguage(lang);
  if (list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function getSession(handlerInput) {
  return handlerInput.attributesManager.getSessionAttributes();
}

// ---------------------------------------------------------------------------
// Bilingual speech strings
// ---------------------------------------------------------------------------

const SPEECH = {
  en: {
    welcome:
      'Welcome to Story Time! I can tell you stories in English and Hindi. ' +
      'Say "English" or "Hindi" to pick a language, or say "play a story" to begin.',
    languageSet: (lang) =>
      `Great, I will tell stories in ${lang === 'hi' ? 'Hindi' : 'English'}. ` +
      'Say "play a story" or ask for a story by name.',
    noStories: 'I don\'t have any stories in that language yet. Try saying "English" or "Hindi".',
    storyList: (titles) => `I have these stories: ${titles.join(', ')}. Which one would you like to hear?`,
    playingStory: (title) => `Here is ${title}.`,
    storyEnd:
      'That was the end of the story! Say "play again" to hear it once more, or "play a story" for another one.',
    storyEndMultiPart: 'Say "next" to continue, or "stop" to end.',
    notFound: 'I could not find that story. Say "list stories" to hear what is available.',
    repeatPrompt: 'Which story would you like to hear?',
    help:
      'You can say: "play a story", "play Leo and the Firefly", "list stories", ' +
      '"English" or "Hindi" to change language, or "stop" to exit.',
    fallback: 'I didn\'t catch that. Say "help" to learn what I can do.',
    goodbye: 'Goodbye! Come back for more stories soon.',
    nextPart: 'Here is the next part.',
    noParts: 'There are no more parts. Say "play again" to hear the story from the beginning.',
  },
  hi: {
    welcome:
      'कहानी टाइम में आपका स्वागत है! मैं आपको अंग्रेज़ी और हिंदी में कहानियाँ सुना सकती हूँ। ' +
      '"अंग्रेज़ी" या "हिंदी" बोलकर भाषा चुनें, या "कहानी सुनाओ" बोलें।',
    languageSet: (lang) =>
      `बहुत अच्छा, मैं ${lang === 'hi' ? 'हिंदी' : 'अंग्रेज़ी'} में कहानी सुनाऊँगी। ` +
      '"कहानी सुनाओ" बोलें या किसी कहानी का नाम बताएँ।',
    noStories: 'इस भाषा में अभी कोई कहानी नहीं है। "अंग्रेज़ी" या "हिंदी" बोलकर देखें।',
    storyList: (titles) => `मेरे पास ये कहानियाँ हैं: ${titles.join(', ')}। कौन सी सुनना चाहेंगे?`,
    playingStory: (title) => `यह रही ${title}।`,
    storyEnd: 'कहानी ख़त्म! "फिर से सुनाओ" बोलें दोबारा सुनने के लिए, या "कहानी सुनाओ" एक और कहानी के लिए।',
    storyEndMultiPart: '"आगे" बोलें जारी रखने के लिए, या "रुको" बोलें।',
    notFound: 'वह कहानी नहीं मिली। "कहानियाँ बताओ" बोलें उपलब्ध कहानियों के लिए।',
    repeatPrompt: 'कौन सी कहानी सुनना चाहेंगे?',
    help:
      'आप बोल सकते हैं: "कहानी सुनाओ", "लियो और जुगनू सुनाओ", "कहानियाँ बताओ", ' +
      '"अंग्रेज़ी" या "हिंदी" भाषा बदलने के लिए, या "रुको" बंद करने के लिए।',
    fallback: 'मुझे समझ नहीं आया। "मदद" बोलें यह जानने के लिए कि मैं क्या कर सकती हूँ।',
    goodbye: 'अलविदा! जल्दी वापस आइए और कहानियाँ सुनिए।',
    nextPart: 'यह रहा अगला भाग।',
    noParts: 'और कोई भाग नहीं है। "फिर से सुनाओ" बोलें शुरू से सुनने के लिए।',
  },
};

function speech(lang, key, ...args) {
  const s = (SPEECH[lang] || SPEECH.en)[key] || SPEECH.en[key];
  return typeof s === 'function' ? s(...args) : s;
}

// ---------------------------------------------------------------------------
// Intent Handlers
// ---------------------------------------------------------------------------

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    setSession(handlerInput, { language: lang });
    return handlerInput.responseBuilder
      .speak(`<speak>${speech(lang, 'welcome')}</speak>`)
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const SetLanguageIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetLanguageIntent'
    );
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots || {};
    const raw = (slots.language && slots.language.value) || '';
    const lower = raw.toLowerCase().trim();

    let lang = 'en';
    if (lower.includes('hindi') || lower.includes('हिंदी') || lower === 'hi') {
      lang = 'hi';
    }

    setSession(handlerInput, { language: lang });

    return handlerInput.responseBuilder
      .speak(`<speak>${speech(lang, 'languageSet', lang)}</speak>`)
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const ListStoriesIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListStoriesIntent'
    );
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    const list = getStoriesByLanguage(lang);

    if (list.length === 0) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'noStories')}</speak>`)
        .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .getResponse();
    }

    const titles = list.map((s) => s.title);
    return handlerInput.responseBuilder
      .speak(`<speak>${speech(lang, 'storyList', titles)}</speak>`)
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const PlayStoryIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      ['PlayStoryIntent', 'PlayLatestIntent'].includes(Alexa.getIntentName(handlerInput.requestEnvelope))
    );
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const slots = handlerInput.requestEnvelope.request.intent.slots || {};
    const storyNameSlot = slots.storyName && slots.storyName.value;

    let story;

    if (intentName === 'PlayLatestIntent' || !storyNameSlot) {
      story = pickRandomStory(lang);
    } else {
      story = findStoryByTitle(lang, storyNameSlot) || findStory(lang, storyNameSlot);
    }

    if (!story) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'notFound')}</speak>`)
        .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .getResponse();
    }

    const parts = toSsmlParts(story.content, lang);
    const currentPart = 0;

    setSession(handlerInput, {
      language: lang,
      currentStoryId: story.id,
      currentPart,
      totalParts: parts.length,
    });

    const intro = speech(lang, 'playingStory', story.title);
    const storyBody = parts[currentPart].replace(/<\/?speak>/g, '');
    const isMultiPart = parts.length > 1;
    const ending = isMultiPart ? speech(lang, 'storyEndMultiPart') : speech(lang, 'storyEnd');

    return handlerInput.responseBuilder
      .speak(
        `<speak>${intro} <break time="800ms"/> ${storyBody} <break time="1s"/> ${ending}</speak>`
      )
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const NextPartIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      ['NextPartIntent', 'AMAZON.NextIntent'].includes(
        Alexa.getIntentName(handlerInput.requestEnvelope)
      )
    );
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    const session = getSession(handlerInput);
    const { currentStoryId, currentPart, totalParts } = session;

    if (!currentStoryId) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .getResponse();
    }

    const nextPart = (currentPart || 0) + 1;

    if (nextPart >= (totalParts || 1)) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'noParts')}</speak>`)
        .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .getResponse();
    }

    const story = findStory(lang, currentStoryId);
    if (!story) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'notFound')}</speak>`)
        .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .getResponse();
    }

    const parts = toSsmlParts(story.content, lang);
    if (!parts[nextPart]) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'noParts')}</speak>`)
        .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .getResponse();
    }
    const storyBody = parts[nextPart].replace(/<\/?speak>/g, '');
    const isLast = nextPart === parts.length - 1;
    const ending = isLast ? speech(lang, 'storyEnd') : speech(lang, 'storyEndMultiPart');

    setSession(handlerInput, { currentPart: nextPart });

    return handlerInput.responseBuilder
      .speak(
        `<speak>${speech(lang, 'nextPart')} <break time="500ms"/> ${storyBody} <break time="1s"/> ${ending}</speak>`
      )
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      ['AMAZON.RepeatIntent', 'RepeatOneIntent'].includes(Alexa.getIntentName(handlerInput.requestEnvelope))
    );
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    const session = getSession(handlerInput);
    const { currentStoryId } = session;

    if (!currentStoryId) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
        .getResponse();
    }

    setSession(handlerInput, { currentPart: 0 });

    const story = findStory(lang, currentStoryId);
    if (!story) {
      return handlerInput.responseBuilder
        .speak(`<speak>${speech(lang, 'notFound')}</speak>`)
        .getResponse();
    }

    const parts = toSsmlParts(story.content, lang);
    const storyBody = parts[0].replace(/<\/?speak>/g, '');
    const isMultiPart = parts.length > 1;
    const ending = isMultiPart ? speech(lang, 'storyEndMultiPart') : speech(lang, 'storyEnd');

    return handlerInput.responseBuilder
      .speak(
        `<speak>${speech(lang, 'playingStory', story.title)} <break time="800ms"/> ${storyBody} <break time="1s"/> ${ending}</speak>`
      )
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    return handlerInput.responseBuilder
      .speak(`<speak>${speech(lang, 'help')}</speak>`)
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      ['AMAZON.CancelIntent', 'AMAZON.StopIntent'].includes(
        Alexa.getIntentName(handlerInput.requestEnvelope)
      )
    );
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    return handlerInput.responseBuilder
      .speak(`<speak>${speech(lang, 'goodbye')}</speak>`)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const lang = getLang(handlerInput);
    return handlerInput.responseBuilder
      .speak(`<speak>${speech(lang, 'fallback')}</speak>`)
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    const reason = handlerInput.requestEnvelope.request.reason;
    if (reason === 'ERROR') {
      console.log('Session ended with error:', JSON.stringify(handlerInput.requestEnvelope.request.error));
    }
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log('Error handled:', error.message, error.stack);
    const lang = getLang(handlerInput);
    return handlerInput.responseBuilder
      .speak('<speak>Sorry, something went wrong. Please try again.</speak>')
      .reprompt(`<speak>${speech(lang, 'repeatPrompt')}</speak>`)
      .getResponse();
  },
};

// ---------------------------------------------------------------------------
// Skill Builder
// ---------------------------------------------------------------------------

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    SetLanguageIntentHandler,
    ListStoriesIntentHandler,
    PlayStoryIntentHandler,
    NextPartIntentHandler,
    RepeatIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
