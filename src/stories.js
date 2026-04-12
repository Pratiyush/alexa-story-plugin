/**
 * Story content module — Indian folklore tales in English and Hindi.
 *
 * Story format:
 *   id       – unique slug (same across languages for the same story)
 *   title    – display title (in target language)
 *   category – story collection (panchatantra, akbar-birbal, vikram-betaal, tenali-raman)
 *   content  – raw story text with custom effect tags:
 *              <chuckle>  <gasp>  <sniffle>  <sigh>
 *              and "…" / "..." for dramatic pauses.
 *              The SSML builder converts these to Alexa-compatible SSML.
 *
 * To add a new story: push an object into the appropriate language array.
 */

const stories = {
  en: [
    // ---- Original Story ----
    {
      id: 'leo-and-the-firefly',
      title: 'Leo and the Firefly',
      category: 'original',
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

    // ---- Panchatantra ----
    {
      id: 'the-monkey-and-the-crocodile',
      title: 'The Monkey and the Crocodile',
      category: 'panchatantra',
      content:
        'Long, long ago… on the banks of a great river… there lived a monkey in a tall jamun tree. <chuckle> He was clever, quick, and loved eating the sweet jamun fruits.\n\n' +
        'One day… a crocodile swam up to the tree. "Those fruits look delicious!" he called out. <gasp>\n\n' +
        'The monkey smiled warmly. "Here, friend… catch!" He threw down the sweetest jamuns he could find. <chuckle>\n\n' +
        'The crocodile was delighted. Day after day… he came back, and the two became the best of friends. They would talk for hours… sharing stories and laughter.\n\n' +
        'But the crocodile\'s wife… she was not happy. <sigh> "These fruits are so sweet," she said one evening. "Imagine how sweet that monkey\'s heart must be! Bring it to me."\n\n' +
        '"But he is my friend!" the crocodile protested. <sniffle>\n\n' +
        '"If you don\'t bring me his heart… I will stop eating," she threatened. The crocodile felt torn… but eventually gave in. <sigh>\n\n' +
        'The next morning… the crocodile invited the monkey for dinner. "Come, sit on my back… I will take you across the river to my home." <chuckle>\n\n' +
        'The monkey happily climbed on. But halfway across the river… the crocodile began to sink. <gasp>\n\n' +
        '"What are you doing?!" the monkey cried out in fear.\n\n' +
        '"I am sorry, friend," the crocodile said sadly. "My wife wants your heart. I must take it to her." <sniffle>\n\n' +
        'The monkey\'s mind raced… but then he smiled. <chuckle> "Oh dear! Why didn\'t you tell me earlier? I left my heart back in the jamun tree! Take me back quickly… and I will get it for you."\n\n' +
        'The foolish crocodile believed him… and swam back to the tree. <gasp>\n\n' +
        'The moment they reached the bank… the monkey leaped onto the tree and climbed to the highest branch. <chuckle>\n\n' +
        '"You fool!" the monkey called down. "No one keeps their heart outside their body! You betrayed our friendship… and now you have lost a true friend forever." <sigh>\n\n' +
        'The crocodile hung his head in shame… and swam away slowly. He never returned.\n\n' +
        'And so… the clever monkey saved his life with his quick thinking. The lesson is clear… true friendship is precious, and betraying trust… always comes at a cost.',
    },

    // ---- Akbar-Birbal ----
    {
      id: 'birbal-counts-the-crows',
      title: 'Birbal Counts the Crows',
      category: 'akbar-birbal',
      content:
        'In the grand court of Emperor Akbar… the Mughal ruler was known for testing the wit of his courtiers. <chuckle> And no one was sharper than his favourite minister… Birbal.\n\n' +
        'One sunny afternoon… as Akbar and Birbal walked through the royal gardens… the emperor looked up at a flock of crows flying overhead. <gasp>\n\n' +
        '"Birbal!" Akbar said suddenly. "I have a question. How many crows are there in our great city of Agra?"\n\n' +
        'The courtiers nearby exchanged worried glances. <sigh> What an impossible question!\n\n' +
        'But Birbal… without missing a beat… smiled confidently. <chuckle>\n\n' +
        '"Jahanpanah… there are exactly twenty-one thousand, five hundred and twenty-three crows in Agra," he declared.\n\n' +
        'Akbar raised an eyebrow. "And what if someone counts and finds more than that number?" <gasp>\n\n' +
        '"Then, Your Majesty… it means some crows from neighbouring cities have come to visit their relatives here," Birbal replied without hesitation. <chuckle>\n\n' +
        '"And if there are fewer?" Akbar pressed.\n\n' +
        '"Then some of our crows have gone to visit their relatives in other cities!" <chuckle>\n\n' +
        'The entire court burst into laughter. <gasp> Even Emperor Akbar could not hold back his smile.\n\n' +
        '"Birbal… you truly are the cleverest man in my kingdom," the emperor said, shaking his head in amusement. <sigh>\n\n' +
        'He rewarded Birbal with a beautiful ruby ring right there in the garden.\n\n' +
        'And so… Birbal proved once again that wisdom is not about knowing every answer… but about having the presence of mind to think on your feet.',
    },

    // ---- Vikram-Betaal ----
    {
      id: 'vikram-and-the-three-suitors',
      title: 'Vikram and the Three Suitors',
      category: 'vikram-betaal',
      content:
        'On a dark, moonless night… the brave King Vikramaditya walked through the ancient cremation ground. <sigh> The wind howled… shadows danced… and an eerie silence hung in the air.\n\n' +
        'He reached the old banyan tree… and found the corpse of Betaal hanging upside down from a branch. <gasp> Vikram pulled him down, threw him over his shoulder… and began walking.\n\n' +
        'Then Betaal spoke. <chuckle> "Vikram, this journey is long and boring. Let me tell you a story. But beware… if you know the answer to my question and stay silent… your head will shatter into a thousand pieces!"\n\n' +
        'Vikram walked on in silence, listening carefully.\n\n' +
        '"There was once a beautiful princess named Padmini," Betaal began. "Three young men fell in love with her. The first was a brave warrior… the second was a learned scholar… and the third was a skilled artist."\n\n' +
        '"One terrible day… Padmini fell gravely ill and died." <sniffle> "The three suitors were heartbroken."\n\n' +
        '"The warrior… driven by grief… became a wandering monk. He gave up everything and lived in the forest." <sigh>\n\n' +
        '"The scholar… studied ancient texts day and night. After months of searching… he found a sacred mantra that could bring the dead back to life!" <gasp>\n\n' +
        '"The artist… could not bear to leave her side. He built a small hut beside her grave… and slept there every night, guarding her resting place." <sniffle>\n\n' +
        '"When the scholar finally returned with the mantra… all three gathered at the grave. The scholar chanted the sacred words… and Padmini came back to life!" <gasp>\n\n' +
        '"Now tell me, Vikram," Betaal asked with a grin. "Who deserves to marry Padmini? The warrior who sacrificed his life for her? The scholar who brought her back? Or the artist who never left her side?" <chuckle>\n\n' +
        'Vikram thought deeply… then spoke. "The scholar brought her back to life… that is what a father does, giving life. The warrior gave up everything… that is devotion, like a monk. But the artist… he stayed by her side through the darkest time… sleeping on the cold ground… never giving up. That… is the love of a true companion. The artist deserves to marry Padmini."\n\n' +
        'Betaal laughed loudly. <chuckle> "Correct, Vikram! But you spoke… and so I fly back to my tree!" And with that… Betaal flew from Vikram\'s shoulder and returned to the banyan tree. <gasp>\n\n' +
        'Vikram sighed… turned around… and walked back to fetch him once more. <sigh> For a king who never gives up… the journey is never over.',
    },

    // ---- Tenali Raman ----
    {
      id: 'tenali-and-the-biggest-fool',
      title: 'Tenali Raman and the Biggest Fool',
      category: 'tenali-raman',
      content:
        'In the magnificent court of King Krishnadevaraya of Vijayanagara… there was one man who could make even the king laugh. <chuckle> His name was Tenali Raman.\n\n' +
        'One day… the king received a gift… a magnificent Arabian horse from a foreign merchant. <gasp> The horse was tall, strong, and beautiful.\n\n' +
        '"This horse is the finest in all the land!" the merchant boasted. "It is worth ten thousand gold coins!"\n\n' +
        'The king was impressed. He turned to his courtiers and said… "I want to breed this horse. But I need to find the biggest fool in my kingdom to take care of it. Fools are simple and honest… they won\'t try to steal it." <chuckle>\n\n' +
        'The courtiers looked at each other nervously. <sigh> No one wanted to be called a fool!\n\n' +
        'Tenali Raman stepped forward with a smile. "Your Majesty… give me three days, and I will find the biggest fool in the kingdom." <chuckle>\n\n' +
        'The king agreed. Tenali went home… and the very next morning… he did something very strange. <gasp>\n\n' +
        'He took a small donkey to the market… decorated it with flowers and bells… and tied a sign around its neck that read: "FOR SALE — MAGIC DONKEY. GIVE IT GRASS TODAY… GET GOLD TOMORROW."\n\n' +
        'People gathered around, laughing. "What nonsense!" they said. <chuckle>\n\n' +
        'But then… a wealthy merchant pushed through the crowd. "How much for this magic donkey?" he asked eagerly.\n\n' +
        '"Five thousand gold coins," Tenali said with a straight face. <gasp>\n\n' +
        'The merchant paid immediately… took the donkey home… fed it the finest grass… and waited all night for gold. <sigh>\n\n' +
        'The next morning… of course… there was no gold. Only donkey droppings. <chuckle>\n\n' +
        'The furious merchant went straight to the king to complain. "Your Majesty! Tenali Raman cheated me!"\n\n' +
        'Tenali stepped forward calmly. "Your Majesty… you asked me to find the biggest fool in the kingdom. Here he is!" He pointed at the merchant. "This man paid five thousand gold coins for a donkey that he believed could make gold from grass!" <chuckle>\n\n' +
        'The entire court erupted in laughter. <gasp> Even the merchant could not help but smile at his own foolishness.\n\n' +
        'King Krishnadevaraya laughed the hardest. "Tenali… you never fail to surprise me!" <chuckle>\n\n' +
        'And so… Tenali proved that the biggest fools are not the simple ones… but those who believe that wealth can come without wisdom or effort. <sigh>',
    },
  ],

  hi: [
    // ---- Original Story ----
    {
      id: 'leo-and-the-firefly',
      title: 'लियो और जुगनू',
      category: 'original',
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

    // ---- Panchatantra ----
    {
      id: 'the-monkey-and-the-crocodile',
      title: 'बंदर और मगरमच्छ',
      category: 'panchatantra',
      content:
        'बहुत समय पहले की बात है… एक बड़ी नदी के किनारे… एक ऊँचे जामुन के पेड़ पर एक बंदर रहता था। <chuckle> वह चतुर था, फुर्तीला था, और मीठे जामुन खाना उसे बहुत पसंद था।\n\n' +
        'एक दिन… एक मगरमच्छ तैरता हुआ उस पेड़ के पास आया। "वो फल तो बड़े स्वादिष्ट दिख रहे हैं!" उसने पुकारा। <gasp>\n\n' +
        'बंदर गर्मजोशी से मुस्कुराया। "लो दोस्त… पकड़ो!" उसने सबसे मीठे जामुन नीचे फेंके। <chuckle>\n\n' +
        'मगरमच्छ खुश हो गया। रोज़… वह वापस आता, और दोनों सबसे अच्छे दोस्त बन गए। वे घंटों बातें करते… कहानियाँ और हँसी बाँटते।\n\n' +
        'लेकिन मगरमच्छ की पत्नी… वह खुश नहीं थी। <sigh> "ये फल इतने मीठे हैं," उसने एक शाम कहा। "सोचो उस बंदर का दिल कितना मीठा होगा! मेरे लिए लेकर आओ।"\n\n' +
        '"लेकिन वह मेरा दोस्त है!" मगरमच्छ ने विरोध किया। <sniffle>\n\n' +
        '"अगर तुम उसका दिल नहीं लाओगे… तो मैं खाना बंद कर दूँगी," उसने धमकी दी। मगरमच्छ बहुत दुविधा में था… लेकिन आखिर में मान गया। <sigh>\n\n' +
        'अगली सुबह… मगरमच्छ ने बंदर को खाने पर बुलाया। "आओ, मेरी पीठ पर बैठो… मैं तुम्हें नदी के उस पार अपने घर ले चलता हूँ।" <chuckle>\n\n' +
        'बंदर खुशी-खुशी चढ़ गया। लेकिन नदी के बीच में… मगरमच्छ डूबने लगा। <gasp>\n\n' +
        '"तुम क्या कर रहे हो?!" बंदर डर से चिल्लाया।\n\n' +
        '"मुझे माफ़ करो, दोस्त," मगरमच्छ ने उदासी से कहा। "मेरी पत्नी को तुम्हारा दिल चाहिए। मुझे उसे ले जाना होगा।" <sniffle>\n\n' +
        'बंदर का दिमाग़ तेज़ी से दौड़ा… और फिर वह मुस्कुराया। <chuckle> "अरे! पहले क्यों नहीं बताया? मैंने तो अपना दिल जामुन के पेड़ पर ही छोड़ दिया है! जल्दी वापस ले चलो… मैं तुम्हें दे दूँगा।"\n\n' +
        'मूर्ख मगरमच्छ उस पर विश्वास कर बैठा… और वापस पेड़ की ओर तैरने लगा। <gasp>\n\n' +
        'किनारे पहुँचते ही… बंदर छलांग लगाकर पेड़ पर चढ़ गया और सबसे ऊँची डाली पर बैठ गया। <chuckle>\n\n' +
        '"मूर्ख!" बंदर ने नीचे पुकारा। "कोई अपना दिल शरीर से बाहर नहीं रखता! तुमने हमारी दोस्ती के साथ विश्वासघात किया… और अब तुमने एक सच्चा दोस्त हमेशा के लिए खो दिया।" <sigh>\n\n' +
        'मगरमच्छ ने शर्म से सिर झुका लिया… और धीरे-धीरे तैरकर चला गया। वह फिर कभी नहीं लौटा।\n\n' +
        'और इस तरह… चतुर बंदर ने अपनी सूझबूझ से अपनी जान बचा ली। सीख यह है… सच्ची दोस्ती अनमोल होती है, और विश्वासघात की कीमत… हमेशा चुकानी पड़ती है।',
    },

    // ---- Akbar-Birbal ----
    {
      id: 'birbal-counts-the-crows',
      title: 'बीरबल ने गिने कौवे',
      category: 'akbar-birbal',
      content:
        'सम्राट अकबर के भव्य दरबार में… मुग़ल शासक अपने दरबारियों की बुद्धि परखने के लिए जाने जाते थे। <chuckle> और किसी की बुद्धि उनके प्रिय मंत्री बीरबल से तेज़ नहीं थी।\n\n' +
        'एक धूप भरी दोपहर… जब अकबर और बीरबल शाही बगीचे में टहल रहे थे… सम्राट ने ऊपर उड़ते कौवों के झुंड को देखा। <gasp>\n\n' +
        '"बीरबल!" अकबर ने अचानक कहा। "मेरे मन में एक सवाल है। हमारे महान शहर आगरा में कितने कौवे हैं?"\n\n' +
        'आसपास के दरबारियों ने चिंतित नज़रों से एक-दूसरे को देखा। <sigh> क्या असंभव सवाल है!\n\n' +
        'लेकिन बीरबल… बिना एक पल गँवाए… आत्मविश्वास से मुस्कुराए। <chuckle>\n\n' +
        '"जहाँपनाह… आगरा में ठीक इक्कीस हज़ार पाँच सौ तेईस कौवे हैं," उन्होंने घोषणा की।\n\n' +
        'अकबर ने एक भौंह उठाई। "और अगर कोई गिने और उससे ज़्यादा निकलें तो?" <gasp>\n\n' +
        '"तो, जहाँपनाह… इसका मतलब है कि पड़ोसी शहरों के कुछ कौवे यहाँ अपने रिश्तेदारों से मिलने आए हैं," बीरबल ने बिना हिचकिचाए जवाब दिया। <chuckle>\n\n' +
        '"और अगर कम निकलें?" अकबर ने दबाव बनाया।\n\n' +
        '"तो हमारे कुछ कौवे दूसरे शहरों में अपने रिश्तेदारों से मिलने गए हैं!" <chuckle>\n\n' +
        'पूरा दरबार हँसी से गूंज उठा। <gasp> सम्राट अकबर भी अपनी मुस्कान नहीं रोक पाए।\n\n' +
        '"बीरबल… तुम सच में मेरे राज्य के सबसे चतुर व्यक्ति हो," सम्राट ने मज़ाक में सिर हिलाते हुए कहा। <sigh>\n\n' +
        'उन्होंने बीरबल को वहीं बगीचे में एक सुंदर माणिक की अँगूठी भेंट की।\n\n' +
        'और इस तरह… बीरबल ने एक बार फिर साबित किया कि बुद्धिमानी हर जवाब जानने में नहीं… बल्कि मौके पर सोचने की कला में है।',
    },

    // ---- Vikram-Betaal ----
    {
      id: 'vikram-and-the-three-suitors',
      title: 'विक्रम और तीन चाहने वाले',
      category: 'vikram-betaal',
      content:
        'एक अंधेरी, चाँदहीन रात में… वीर राजा विक्रमादित्य प्राचीन श्मशान भूमि में चल रहे थे। <sigh> हवा गरज रही थी… परछाइयाँ नाच रही थीं… और एक भयानक सन्नाटा छाया हुआ था।\n\n' +
        'वे पुराने बरगद के पेड़ तक पहुँचे… और बेताल का शव एक डाल से उलटा लटका हुआ पाया। <gasp> विक्रम ने उसे नीचे उतारा, कंधे पर डाला… और चलने लगे।\n\n' +
        'तभी बेताल बोला। <chuckle> "विक्रम, यह सफ़र लंबा और उबाऊ है। चलो मैं तुम्हें एक कहानी सुनाता हूँ। लेकिन सावधान… अगर तुम मेरे सवाल का जवाब जानकर भी चुप रहे… तो तुम्हारा सिर हज़ार टुकड़ों में बिखर जाएगा!"\n\n' +
        'विक्रम चुपचाप चलते रहे, ध्यान से सुनते हुए।\n\n' +
        '"एक बार एक सुंदर राजकुमारी थी जिसका नाम पद्मिनी था," बेताल ने शुरू किया। "तीन युवक उससे प्रेम करते थे। पहला एक वीर योद्धा था… दूसरा एक विद्वान पंडित था… और तीसरा एक कुशल कलाकार था।"\n\n' +
        '"एक भयानक दिन… पद्मिनी बहुत बीमार पड़ी और उसकी मृत्यु हो गई।" <sniffle> "तीनों चाहने वाले टूट गए।"\n\n' +
        '"योद्धा… दुख से विचलित होकर… एक भटकता साधु बन गया। उसने सब कुछ त्याग दिया और जंगल में रहने लगा।" <sigh>\n\n' +
        '"विद्वान ने… दिन-रात प्राचीन ग्रंथों का अध्ययन किया। महीनों की खोज के बाद… उसे एक पवित्र मंत्र मिला जो मृतकों को जीवित कर सकता था!" <gasp>\n\n' +
        '"कलाकार… उससे दूर नहीं रह सका। उसने उसकी क़ब्र के बगल में एक छोटी झोपड़ी बनाई… और हर रात वहीं सोता, उसकी अंतिम विश्राम स्थली की रखवाली करता।" <sniffle>\n\n' +
        '"जब विद्वान आखिरकार मंत्र लेकर लौटा… तीनों क़ब्र पर इकट्ठे हुए। विद्वान ने पवित्र शब्द पढ़े… और पद्मिनी जीवित हो उठी!" <gasp>\n\n' +
        '"अब बताओ, विक्रम," बेताल ने मुस्कुराते हुए पूछा। "पद्मिनी से विवाह का अधिकार किसे है? योद्धा जिसने उसके लिए सब कुछ त्याग दिया? विद्वान जिसने उसे जीवन वापस दिया? या कलाकार जिसने उसका साथ कभी नहीं छोड़ा?" <chuckle>\n\n' +
        'विक्रम ने गहराई से सोचा… फिर बोले। "विद्वान ने उसे जीवन दिया… यह वही करता है जो एक पिता करता है। योद्धा ने सब कुछ त्याग दिया… यह एक साधु की भक्ति है। लेकिन कलाकार… वह सबसे अंधेरे समय में उसके पास रहा… ठंडी ज़मीन पर सोया… कभी हार नहीं मानी। यही… सच्चे साथी का प्रेम है। कलाकार को पद्मिनी से विवाह करना चाहिए।"\n\n' +
        'बेताल ज़ोर से हँसा। <chuckle> "सही जवाब, विक्रम! लेकिन तुमने बोल दिया… इसलिए मैं वापस अपने पेड़ पर उड़ता हूँ!" और इतना कहकर… बेताल विक्रम के कंधे से उड़कर बरगद पर लौट गया। <gasp>\n\n' +
        'विक्रम ने आह भरी… पलटे… और उसे फिर लाने के लिए वापस चल पड़े। <sigh> क्योंकि जो राजा कभी हार नहीं मानता… उसकी यात्रा कभी ख़त्म नहीं होती।',
    },

    // ---- Tenali Raman ----
    {
      id: 'tenali-and-the-biggest-fool',
      title: 'तेनाली रामन और सबसे बड़ा मूर्ख',
      category: 'tenali-raman',
      content:
        'विजयनगर के महान राजा कृष्णदेवराय के शानदार दरबार में… एक आदमी था जो राजा को भी हँसा सकता था। <chuckle> उसका नाम था तेनाली रामन।\n\n' +
        'एक दिन… राजा को एक उपहार मिला… एक विदेशी व्यापारी से एक शानदार अरबी घोड़ा। <gasp> घोड़ा लंबा, मज़बूत और बहुत सुंदर था।\n\n' +
        '"यह घोड़ा पूरे देश में सबसे बेहतरीन है!" व्यापारी ने घमंड से कहा। "इसकी कीमत दस हज़ार सोने के सिक्के है!"\n\n' +
        'राजा प्रभावित हुए। उन्होंने अपने दरबारियों की ओर मुड़कर कहा… "मैं इस घोड़े की नस्ल बढ़ाना चाहता हूँ। लेकिन मुझे अपने राज्य का सबसे बड़ा मूर्ख चाहिए जो इसकी देखभाल करे। मूर्ख सीधे और ईमानदार होते हैं… वे इसे चुराने की कोशिश नहीं करेंगे।" <chuckle>\n\n' +
        'दरबारी घबराकर एक-दूसरे को देखने लगे। <sigh> कोई भी मूर्ख नहीं कहलाना चाहता था!\n\n' +
        'तेनाली रामन मुस्कुराते हुए आगे आए। "महाराज… मुझे तीन दिन दीजिए, और मैं राज्य का सबसे बड़ा मूर्ख ढूंढ लाऊँगा।" <chuckle>\n\n' +
        'राजा मान गए। तेनाली घर गए… और अगली सुबह… उन्होंने कुछ बहुत अजीब किया। <gasp>\n\n' +
        'वे एक छोटे गधे को बाज़ार ले गए… उसे फूलों और घंटियों से सजाया… और उसके गले में एक तख्ती बाँधी जिस पर लिखा था: "बिक्री के लिए — जादुई गधा। आज घास दो… कल सोना मिलेगा।"\n\n' +
        'लोग इकट्ठा हो गए, हँसते हुए। "क्या बकवास है!" वे बोले। <chuckle>\n\n' +
        'लेकिन तभी… एक अमीर सेठ भीड़ चीरता हुआ आया। "इस जादुई गधे की क्या कीमत है?" उसने उत्सुकता से पूछा।\n\n' +
        '"पाँच हज़ार सोने के सिक्के," तेनाली ने बिना हँसे कहा। <gasp>\n\n' +
        'सेठ ने तुरंत पैसे दे दिए… गधे को घर ले गया… उसे बढ़िया घास खिलाई… और सारी रात सोने का इंतज़ार करता रहा। <sigh>\n\n' +
        'अगली सुबह… ज़ाहिर है… कोई सोना नहीं था। बस गधे की लीद। <chuckle>\n\n' +
        'गुस्से से लाल सेठ सीधे राजा के पास शिकायत करने गया। "महाराज! तेनाली रामन ने मुझे ठगा है!"\n\n' +
        'तेनाली शांति से आगे आए। "महाराज… आपने मुझसे राज्य का सबसे बड़ा मूर्ख ढूंढने को कहा था। यह रहा!" उन्होंने सेठ की ओर इशारा किया। "इस आदमी ने पाँच हज़ार सोने के सिक्के एक गधे के लिए दिए जो घास से सोना बनाएगा!" <chuckle>\n\n' +
        'पूरा दरबार हँसी से गूंज उठा। <gasp> सेठ भी अपनी मूर्खता पर मुस्कुराए बिना नहीं रह सका।\n\n' +
        'राजा कृष्णदेवराय सबसे ज़्यादा हँसे। "तेनाली… तुम मुझे कभी चौंकाना बंद नहीं करते!" <chuckle>\n\n' +
        'और इस तरह… तेनाली ने साबित किया कि सबसे बड़े मूर्ख सीधे-सादे लोग नहीं होते… बल्कि वे होते हैं जो मानते हैं कि बिना बुद्धि और मेहनत के दौलत आ सकती है। <sigh>',
    },
  ],
};

// Merge 15 new folklore stories
const { newStoriesEn, newStoriesHi } = require('./stories_new');
stories.en.push(...newStoriesEn);
stories.hi.push(...newStoriesHi);

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
