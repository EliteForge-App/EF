import demoHi from "./demo-hi"
import { Translations } from "./en"

const hi: Translations = {
  common: {
    ok: "ठीक है!",
    cancel: "रद्द करें",
    back: "वापस",
    logOut: "लॉग आउट",
  },
  welcomeScreen: {
    postscript:
      "psst - शायद आपका ऐप ऐसा नहीं दिखता है। (जब तक कि आपके डिजाइनर ने आपको ये स्क्रीन नहीं दी हों, और उस स्थिति में, इसे लॉन्च करें!)",
    readyForLaunch: "आपका ऐप, लगभग लॉन्च के लिए तैयार है!",
    exciting: "(ओह, यह रोमांचक है!)",
    letsGo: "चलो चलते हैं!",
  },
  errorScreen: {
    title: "कुछ गलत हो गया!",
    friendlySubtitle:
      "यह वह स्क्रीन है जो आपके उपयोगकर्ता संचालन में देखेंगे जब कोई त्रुटि होगी। आप इस संदेश को बदलना चाहेंगे (जो `app/i18n/hi.ts` में स्थित है) और शायद लेआउट भी (`app/screens/ErrorScreen`)। यदि आप इसे पूरी तरह से हटाना चाहते हैं, तो `app/app.tsx` में <ErrorBoundary> कंपोनेंट की जांच करें।",
    reset: "ऐप रीसेट करें",
    traceTitle: "%{name} स्टैक से त्रुटि",
  },
  emptyStateComponent: {
    generic: {
      heading: "इतना खाली... इतना उदास",
      content: "अभी तक कोई डेटा नहीं मिला। रीफ्रेश करने या ऐप को पुनः लोड करने के लिए बटन दबाएं।",
      button: "चलो फिर से कोशिश करते हैं",
    },
  },

  errors: {
    invalidEmail: "अमान्य ईमेल पता।",
  },
  loginScreen: {
    logIn: "लॉग इन करें",
    subtitle: "वापसी पर स्वागत है",
    usernameFieldLabel: "उपयोगकर्ता नाम",
    usernameFieldPlaceholder: "अपना उपयोगकर्ता नाम",
    passwordFieldLabel: "पासवर्ड",
    passwordFieldPlaceholder: "अपना पासवर्ड दर्ज करें",
    signInButton: "लॉग इन करें",
    signingIn: "लॉग इन हो रहा है...",
    emptyFields: "कृपया ईमेल और पासवर्ड दर्ज करें।",
    invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें।",
    passwordLength: "पासवर्ड 8 से 72 अक्षरों के बीच होना चाहिए।",
    invalidCredentials: "ईमेल या पासवर्ड गलत है।",
    cannotConnect: "सर्वर से कनेक्ट नहीं हो सका। अपना कनेक्शन जांचें।",
    serverError: "सर्वर त्रुटि। बाद में पुनः प्रयास करें।",
    loginFailed: "लॉग इन विफल। कृपया पुनः प्रयास करें।",
    createAccountPrompt: "खाता नहीं है?",
    createAccountLink: "खाता बनाएं",
    googleButton: "Gmail के साथ जारी रखें",
    facebookButton: "Facebook के साथ जारी रखें",
    signingInShort: "…",
    uiPreviewButton: "बिना बैकएंड जारी रखें (UI)",
    settingsSoon: "Settings will be available soon.",
  },
  registerScreen: {
    title: "खाता बनाएं",
    subtitle: "Elite Forge में शामिल हों और अपनी कहानी बनाएं।",
  },
  feedScreen: {
    title: "Feed",
    guestUser: "खिलाड़ी",
    openMenu: "मेनू खोलें",
    composerPlaceholder: "आप क्या साझा करना चाहते हैं?",
    composerPhoto: "फ़ोटो",
    composerVideo: "वीडियो",
    composerMatch: "मैच",
    composerSoon: "पोस्ट करना जल्द उपलब्ध होगा।",
    composeTitle: "पोस्ट बनाएं",
    composePlaceholder: "क्या चल रहा है?",
    composePost: "पोस्ट",
    composeCancel: "रद्द करें",
    composeAudience: "सभी के लिए दृश्य",
    shareTitle: "पोस्ट साझा करें",
    shareFrom: "{{name}} से",
    shareCopyLink: "लिंक कॉपी करें",
    shareSendFriends: "मित्रों को भेजें",
    shareExternal: "इसके द्वारा साझा करें…",
    like: "पसंद",
    comment: "टिप्पणी",
    share: "साझा करें",
    likesCount: "{{count}} पसंद",
    commentsCount: "{{count}} टिप्पणियाँ",
    time2h: "2 घंटे",
    time5h: "5 घंटे",
    time1d: "1 दिन",
    time2d: "2 दिन",
    timeSponsored: "प्रायोजित",
    adBadge: "आधिकारिक",
    adCta: "और जानें",
    adCtaLearn: "Elite Forge में शामिल हों",
    adPost1: "अपनी कहानी बनाएं। प्रशिक्षण, खेल और जुड़ाव।",
    adPost2: "नया सीज़न, नए लक्ष्य। Elite Forge इवेंट देखें।",
    post1: "आज शानदार मैच था!",
    post2: "रविवार के 8v8 के लिए मिडफील्डर चाहिए।",
    post3: "सीज़न का पहला गोल। मेहनत रंग लाई!",
    post4: "कल की ट्रेनिंग। हर टच मायने रखता है।",
  },
  feedDrawer: {
    sectionMenu: "मेनू",
    profile: "प्रोफ़ाइल",
    groups: "समूह",
    matches: "मैच",
    reservations: "आरक्षण",
    comingSoon: "जल्द आ रहा है",
    comingSoonTitle: "जल्द आ रहा है",
    profileSoon: "प्रोफ़ाइल जल्द उपलब्ध होगी।",
    groupsSoon: "समूह जल्द उपलब्ध होंगे।",
    matchesSoon: "मैच जल्द उपलब्ध होंगे।",
    reservationsSoon: "आरक्षण जल्द उपलब्ध होंगे।",
  },
  demoNavigator: {
    componentsTab: "कंपोनेंट्स",
    debugTab: "डीबग",
    communityTab: "समुदाय",
    podcastListTab: "पॉडकास्ट",
  },
  demoCommunityScreen: {
    title: "समुदाय से जुड़ें",
    tagLine:
      "Infinite Red के React Native इंजीनियरों के समुदाय से जुड़ें और हमारे साथ अपने ऐप विकास को बेहतर बनाएं!",
    joinUsOnSlackTitle: "Slack पर हमसे जुड़ें",
    joinUsOnSlack:
      "क्या आप चाहते हैं कि दुनिया भर के React Native इंजीनियरों से जुड़ने के लिए कोई जगह हो? Infinite Red Community Slack में बातचीत में शामिल हों! हमारा बढ़ता हुआ समुदाय प्रश्न पूछने, दूसरों से सीखने और अपने नेटवर्क को बढ़ाने के लिए एक सुरक्षित स्थान है।",
    joinSlackLink: "Slack समुदाय में शामिल हों",
    makeIgniteEvenBetterTitle: "Ignite को और बेहतर बनाएं",
    makeIgniteEvenBetter:
      "Ignite को और बेहतर बनाने का कोई विचार है? हमें यह सुनकर खुशी होगी! हम हमेशा ऐसे लोगों की तलाश में रहते हैं जो हमें सर्वश्रेष्ठ React Native टूलिंग बनाने में मदद करना चाहते हैं। Ignite के भविष्य को बनाने में हमारे साथ शामिल होने के लिए GitHub पर हमसे जुड़ें।",
    contributeToIgniteLink: "Ignite में योगदान दें",
    theLatestInReactNativeTitle: "React Native में नवीनतम",
    theLatestInReactNative: "हम आपको React Native के सभी प्रस्तावों पर अपडेट रखने के लिए यहां हैं।",
    reactNativeRadioLink: "React Native रेडियो",
    reactNativeNewsletterLink: "React Native न्यूजलेटर",
    reactNativeLiveLink: "React Native लाइव",
    chainReactConferenceLink: "Chain React कॉन्फ्रेंस",
    hireUsTitle: "अपने अगले प्रोजेक्ट के लिए Infinite Red को काम पर रखें",
    hireUs:
      "चाहे वह एक पूरा प्रोजेक्ट चलाना हो या हमारे हैंड्स-ऑन प्रशिक्षण के साथ टीमों को गति देना हो, Infinite Red लगभग किसी भी React Native प्रोजेक्ट में मदद कर सकता है।",
    hireUsLink: "हमें एक संदेश भेजें",
  },
  demoShowroomScreen: {
    jumpStart: "अपने प्रोजेक्ट को जंप स्टार्ट करने के लिए कंपोनेंट्स!",
    lorem2Sentences:
      "कोई भी काम जो आप नहीं करना चाहते, उसे करने के लिए किसी और को ढूंढना चाहिए। जो लोग दूसरों की मदद करते हैं, वे खुद की भी मदद करते हैं।",
    demoHeaderTxExample: "हाँ",
    demoViaTxProp: "`tx` प्रॉप के माध्यम से",
    demoViaSpecifiedTxProp: "`{{prop}}Tx` प्रॉप के माध्यम से",
  },
  demoDebugScreen: {
    howTo: "कैसे करें",
    title: "डीबग",
    tagLine:
      "बधाई हो, आपके पास यहां एक बहुत उन्नत React Native ऐप टेम्पलेट है। इस बॉयलरप्लेट का लाभ उठाएं!",
    reactotron: "Reactotron को भेजें",
    reportBugs: "बग्स की रिपोर्ट करें",
    demoList: "डेमो सूची",
    demoPodcastList: "डेमो पॉडकास्ट सूची",
    androidReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है, अपने टर्मिनल से adb reverse tcp:9090 tcp:9090 चलाएं, और ऐप को पुनः लोड करें।",
    iosReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
    macosReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
    webReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
    windowsReactotronHint:
      "यदि यह काम नहीं करता है, तो सुनिश्चित करें कि Reactotron डेस्कटॉप ऐप चल रहा है और ऐप को पुनः लोड करें।",
  },
  demoPodcastListScreen: {
    title: "React Native रेडियो एपिसोड",
    onlyFavorites: "केवल पसंदीदा दिखाएं",
    favoriteButton: "पसंदीदा",
    unfavoriteButton: "नापसंद",
    accessibility: {
      cardHint:
        "एपिसोड सुनने के लिए डबल टैप करें। इस एपिसोड को {{action}} करने के लिए डबल टैप करें और होल्ड करें।",
      switch: "केवल पसंदीदा दिखाने के लिए स्विच करें",
      favoriteAction: "पसंदीदा टॉगल करें",
      favoriteIcon: "एपिसोड पसंदीदा नहीं है",
      unfavoriteIcon: "एपिसोड पसंदीदा है",
      publishLabel: "{{date}} को प्रकाशित",
      durationLabel: "अवधि: {{hours}} घंटे {{minutes}} मिनट {{seconds}} सेकंड",
    },
    noFavoritesEmptyState: {
      heading: "यह थोड़ा खाली लगता है",
      content:
        "अभी तक कोई पसंदीदा नहीं जोड़ा गया है। इसे अपने पसंदीदा में जोड़ने के लिए किसी एपिसोड पर दिल पर टैप करें!",
    },
  },

  ...demoHi,
}

export default hi
