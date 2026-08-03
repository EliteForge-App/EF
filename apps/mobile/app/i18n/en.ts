import demoEn from "./demo-en"

const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    logIn: "Log In",
    subtitle: "Welcome back, forger",
    usernameFieldLabel: "Email",
    usernameFieldPlaceholder: "you@email.com",
    passwordFieldLabel: "Password",
    passwordFieldPlaceholder: "Your password",
    signInButton: "Sign in",
    signingIn: "Signing in...",
    emptyFields: "Please enter your email and password.",
    invalidEmail: "Please enter a valid email address.",
    passwordLength: "Password must be between 8 and 72 characters.",
    invalidCredentials: "Incorrect email or password.",
    cannotConnect: "Could not connect to the server. Check your connection and try again.",
    serverError: "Server error. Please try again later.",
    loginFailed: "Sign in failed. Please try again.",
    createAccountPrompt: "Don't have an account?",
    createAccountLink: "Create account",
    googleButton: "Continue with Gmail",
    facebookButton: "Continue with Facebook",
    signingInShort: "…",
    uiPreviewButton: "Enter without backend (UI)",
    settingsSoon: "Settings will be available soon.",
  },
  registerScreen: {
    title: "Create account",
    subtitle: "Opening the sign-up form in your browser…",
  },
  feedScreen: {
    title: "Feed",
    guestUser: "Player",
    openMenu: "Open menu",
    composerPlaceholder: "What's on your mind, forger?",
    composerPhoto: "Photo",
    composerVideo: "Video",
    composerMatch: "Match",
    composerSoon: "Creating posts will be available soon.",
    composeTitle: "Create post",
    composePlaceholder: "What's happening, forger?",
    composePost: "Post",
    composeCancel: "Cancel",
    composeAudience: "Visible to everyone",
    shareTitle: "Share post",
    shareFrom: "From {{name}}",
    shareCopyLink: "Copy link",
    shareSendFriends: "Send to friends",
    shareExternal: "Share via…",
    like: "Like",
    comment: "Comment",
    share: "Share",
    likesCount: "{{count}} likes",
    commentsCount: "{{count}} comments",
    time2h: "2 h",
    time5h: "5 h",
    time1d: "1 d",
    time2d: "2 d",
    timeSponsored: "Sponsored",
    adBadge: "Official",
    adCta: "Learn more",
    adCtaLearn: "Join Elite Forge",
    adPost1: "Forge your legend. Train, play and connect with players near you.",
    adPost2: "New season, new goals. Discover tournaments and Elite Forge events in your city.",
    post1: "Great match today! Nothing like a full pitch with the team after a tough week.",
    post2: "Looking for midfielders for Sunday's 8v8. Who's in?",
    post3: "First goal of the season. The grind is paying off!",
    post4: "Yesterday's training session. Every touch counts.",
  },
  feedDrawer: {
    sectionMenu: "Menu",
    profile: "Profile",
    groups: "Groups",
    matches: "Matches",
    reservations: "Reservations",
    comingSoon: "Coming soon",
    comingSoonTitle: "Coming soon",
    profileSoon: "Your player profile will be available here soon.",
    groupsSoon: "Groups and squads will be available here soon.",
    matchesSoon: "Matches and fixtures will be available here soon.",
    reservationsSoon: "Field reservations will be available here soon.",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },

  ...demoEn,
}

export default en
export type Translations = typeof en
