/**
 * Story content module — all stories in English and Hindi.
 *
 * Story format:
 *   id       – unique slug (same across languages for the same story)
 *   title    – display title (in target language)
 *   content  – raw story text with custom effect tags:
 *              <chuckle>  <gasp>  <sniffle>  <sigh>
 *              and "…" / "..." for dramatic pauses.
 *              The SSML builder converts these to Alexa-compatible SSML.
 *
 * To add a new story: push an object into the appropriate language array.
 */

const stories = {
  en: [
    {
      id: 'leo-and-the-firefly',
      title: 'Leo and the Firefly',
      content:
        'Once upon a time… there was a little boy named Leo. <chuckle> He loved playing in the forest near his home.\n\n' +
        'One evening, while chasing a butterfly, Leo wandered a bit too far. <gasp> The sun slowly began to set… and the forest turned dark and quiet.\n\n' +
        '"I… I think I\'m lost," he whispered. <sniffle>\n\n' +
        'The trees felt taller… the shadows deeper… and strange sounds echoed all around him. <sigh> Leo sat down, hugging his knees, feeling very scared.\n\n' +
        'Then suddenly… he heard a soft voice. "Why are you crying?" <gasp>\n\n' +
        'Leo looked up and saw a tiny glowing firefly. "I can\'t find my way home," he said sadly. <sniffle>\n\n' +
        '"Hey… don\'t worry," the firefly said gently. <chuckle> "Just follow me."\n\n' +
        'Leo stood up slowly… and followed the tiny light through the dark forest. Step by step… his fear started to fade.\n\n' +
        'After a while, he saw a familiar path. <gasp> "That\'s my home!" he shouted with joy.\n\n' +
        'His mother ran toward him and hugged him tightly. <sigh> "I was so worried!"\n\n' +
        'Leo smiled, finally feeling safe again. "I was scared… but I found my way," he said softly.\n\n' +
        'The firefly blinked once… and disappeared into the night. <chuckle>\n\n' +
        'And from that day on… Leo learned that even in the darkest moments… a little light can guide you home.',
    },
  ],

  hi: [
    {
      id: 'leo-and-the-firefly',
      title: 'लियो और जुगनू',
      content:
        'एक समय की बात है… एक छोटा लड़का था, जिसका नाम लियो था। <chuckle> उसे अपने घर के पास के जंगल में खेलना बहुत पसंद था।\n\n' +
        'एक शाम, एक तितली का पीछा करते-करते… लियो थोड़ा ज़्यादा दूर निकल गया। <gasp> सूरज धीरे-धीरे ढलने लगा… और जंगल अंधेरा और शांत हो गया।\n\n' +
        '"मुझे… लगता है मैं रास्ता भटक गया हूँ," उसने धीरे से कहा। <sniffle>\n\n' +
        'पेड़ और ऊँचे लगने लगे… परछाइयाँ गहरी हो गईं… और अजीब आवाज़ें उसके चारों ओर गूंजने लगीं। <sigh> लियो बैठ गया, अपने घुटनों को पकड़कर… वह बहुत डर गया था।\n\n' +
        'तभी अचानक… उसे एक नरम आवाज़ सुनाई दी। "तुम रो क्यों रहे हो?" <gasp>\n\n' +
        'लियो ने ऊपर देखा… और एक छोटी सी चमकती जुगनू को देखा। "मैं घर का रास्ता नहीं ढूंढ पा रहा हूँ," उसने उदासी से कहा। <sniffle>\n\n' +
        '"अरे… चिंता मत करो," जुगनू ने धीरे से कहा। <chuckle> "मेरे पीछे आओ।"\n\n' +
        'लियो धीरे-धीरे खड़ा हुआ… और उस छोटी रोशनी के पीछे चलने लगा। कदम दर कदम… उसका डर कम होने लगा।\n\n' +
        'कुछ समय बाद… उसे एक जाना-पहचाना रास्ता दिखा। <gasp> "यह मेरा घर है!" वह खुशी से चिल्लाया।\n\n' +
        'उसकी माँ उसकी ओर दौड़ी… और उसे कसकर गले लगा लिया। <sigh> "मैं बहुत चिंतित थी!"\n\n' +
        'लियो मुस्कुराया… अब वह सुरक्षित महसूस कर रहा था। "मैं डर गया था… लेकिन मुझे रास्ता मिल गया," उसने धीरे से कहा।\n\n' +
        'जुगनू एक बार चमका… और रात में गायब हो गया। <chuckle>\n\n' +
        'और उस दिन के बाद… लियो ने सीखा कि सबसे अंधेरे पलों में भी… एक छोटी सी रोशनी आपको रास्ता दिखा सकती है।',
    },
  ],
};

/**
 * Get all stories for a language.
 * @param {'en'|'hi'} lang
 * @returns {Array} story list (empty array if lang not found)
 */
function getStoriesByLanguage(lang) {
  return stories[lang] || [];
}

/**
 * Find a story by ID across a given language.
 * @param {'en'|'hi'} lang
 * @param {string} id
 * @returns {object|null}
 */
function findStory(lang, id) {
  const list = getStoriesByLanguage(lang);
  return list.find((s) => s.id === id) || null;
}

/**
 * Find a story by fuzzy title match within a language.
 * @param {'en'|'hi'} lang
 * @param {string} query – user-spoken title (may be partial or imprecise)
 * @returns {object|null}
 */
function findStoryByTitle(lang, query) {
  const list = getStoriesByLanguage(lang);
  const q = query.toLowerCase().trim();

  // exact match first
  const exact = list.find((s) => s.title.toLowerCase() === q);
  if (exact) return exact;

  // partial match
  return list.find((s) => s.title.toLowerCase().includes(q) || q.includes(s.title.toLowerCase())) || null;
}

/**
 * Get supported language codes.
 * @returns {string[]}
 */
function getSupportedLanguages() {
  return Object.keys(stories);
}

module.exports = {
  stories,
  getStoriesByLanguage,
  findStory,
  findStoryByTitle,
  getSupportedLanguages,
};
