import demoJa from "./demo-ja"
import { Translations } from "./en"

const ja: Translations = {
  common: {
    ok: "OK",
    cancel: "キャンセル",
    back: "戻る",
    logOut: "ログアウト",
  },
  welcomeScreen: {
    postscript:
      "注目！ — このアプリはお好みの見た目では無いかもしれません(デザイナーがこのスクリーンを送ってこない限りは。もしそうなら公開しちゃいましょう！)",
    readyForLaunch: "このアプリはもう少しで公開できます！",
    exciting: "(楽しみですね！)",
    letsGo: "レッツゴー！",
  },
  errorScreen: {
    title: "問題が発生しました",
    friendlySubtitle:
      "本番では、エラーが投げられた時にこのページが表示されます。もし使うならこのメッセージに変更を加えてください(`app/i18n/jp.ts`)レイアウトはこちらで変更できます(`app/screens/ErrorScreen`)。もしこのスクリーンを取り除きたい場合は、`app/app.tsx`にある<ErrorBoundary>コンポーネントをチェックしてください",
    reset: "リセット",
    traceTitle: "エラーのスタック: %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "静かだ...悲しい。",
      content:
        "データが見つかりません。ボタンを押してアプリをリロード、またはリフレッシュしてください。",
      button: "もう一度やってみよう",
    },
  },

  errors: {
    invalidEmail: "有効なメールアドレスを入力してください.",
  },
  loginScreen: {
    logIn: "ログイン",
    subtitle: "おかえりなさい",
    usernameFieldLabel: "ユーザー名",
    usernameFieldPlaceholder: "ユーザー名を入力",
    passwordFieldLabel: "パスワード",
    passwordFieldPlaceholder: "パスワードを入力",
    signInButton: "ログイン",
    signingIn: "ログイン中...",
    emptyFields: "メールアドレスとパスワードを入力してください。",
    invalidEmail: "有効なメールアドレスを入力してください。",
    invalidCredentials: "メールアドレスまたはパスワードが正しくありません。",
    cannotConnect: "サーバーに接続できません。接続を確認して再試行してください。",
    serverError: "サーバーエラーです。後でもう一度お試しください。",
    loginFailed: "ログインに失敗しました。もう一度お試しください。",
    createAccountPrompt: "アカウントをお持ちでないですか？",
    createAccountLink: "アカウント作成",
    continueWith: "または次で続行",
    googleButton: "Gmailで続行",
    facebookButton: "Facebookで続行",
    googleButtonShort: "Gmail",
    facebookButtonShort: "Facebook",
    uiPreviewButton: "バックエンドなしで続行（UI）",
  },
  registerScreen: {
    title: "アカウント作成",
    subtitle: "Elite Forgeに参加して伝説を築きましょう。",
  },
  feedScreen: {
    title: "Feed",
    guestUser: "プレイヤー",
    openMenu: "メニューを開く",
    composerPlaceholder: "何を共有しますか？",
    composerPhoto: "写真",
    composerVideo: "動画",
    composerMatch: "試合",
    composerSoon: "投稿機能は近日公開予定です。",
    composeTitle: "投稿を作成",
    composePlaceholder: "いまどうしてる？",
    composePost: "投稿",
    composeCancel: "キャンセル",
    composeAudience: "全員に公開",
    shareTitle: "投稿をシェア",
    shareFrom: "{{name}} から",
    shareCopyLink: "リンクをコピー",
    shareSendFriends: "友達に送る",
    shareExternal: "その他でシェア…",
    like: "いいね",
    comment: "コメント",
    share: "シェア",
    likesCount: "{{count}} いいね",
    commentsCount: "{{count}} コメント",
    time2h: "2時間",
    time5h: "5時間",
    time1d: "1日",
    time2d: "2日",
    timeSponsored: "スポンサー",
    adBadge: "公式",
    adCta: "詳細を見る",
    adCtaLearn: "Elite Forgeに参加",
    adPost1: "伝説を築こう。トレーニング、プレー、つながり。",
    adPost2: "新シーズン、新目標。Elite Forgeのイベントをチェック。",
    post1: "今日は素晴らしい試合でした！",
    post2: "日曜の8v8用にミッドフィルダーを探しています。",
    post3: "シーズン初ゴール。努力が実った！",
    post4: "昨日のトレーニング。すべてのタッチが大切。",
  },
  feedDrawer: {
    sectionMenu: "メニュー",
    profile: "プロフィール",
    groups: "グループ",
    matches: "試合",
    reservations: "予約",
    comingSoon: "近日公開",
    comingSoonTitle: "近日公開",
    profileSoon: "プロフィールは近日公開予定です。",
    groupsSoon: "グループは近日公開予定です。",
    matchesSoon: "試合は近日公開予定です。",
    reservationsSoon: "予約は近日公開予定です。",
  },
  demoNavigator: {
    componentsTab: "コンポーネント",
    debugTab: "デバッグ",
    communityTab: "コミュニティ",
    podcastListTab: "ポッドキャスト",
  },
  demoCommunityScreen: {
    title: "コミュニティと繋がろう",
    tagLine:
      "Infinite RedのReact Nativeエンジニアコミュニティに接続して、一緒にあなたのアプリ開発をレベルアップしましょう！",
    joinUsOnSlackTitle: "私たちのSlackに参加しましょう",
    joinUsOnSlack:
      "世界中のReact Nativeエンジニアと繋がりたいを思いませんか？Infinite RedのコミュニティSlackに参加しましょう！私達のコミュニティは安全に質問ができ、お互いから学び、あなたのネットワークを広げることができます。",
    joinSlackLink: "Slackコミュニティに参加する",
    makeIgniteEvenBetterTitle: "Igniteをより良くする",
    makeIgniteEvenBetter:
      "Igniteをより良くする為のアイデアはありますか? そうであれば聞きたいです！ 私たちはいつでも最良のReact Nativeのツールを開発する為に助けを求めています。GitHubで私たちと一緒にIgniteの未来を作りましょう。",
    contributeToIgniteLink: "Igniteにコントリビュートする",
    theLatestInReactNativeTitle: "React Nativeの今",
    theLatestInReactNative: "React Nativeの現在をあなたにお届けします。",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "あなたの次のプロジェクトでInfinite Redと契約する",
    hireUs:
      "それがプロジェクト全体でも、チームにトレーニングをしてあげたい時でも、Infinite RedはReact Nativeのことであればなんでもお手伝いができます。",
    hireUsLink: "メッセージを送る",
  },
  demoShowroomScreen: {
    jumpStart: "あなたのプロジェクトをスタートさせるコンポーネントです！",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "`tx`から",
    demoViaSpecifiedTxProp: "`{{prop}}Tx`から",
  },
  demoDebugScreen: {
    howTo: "ハウツー",
    title: "デバッグ",
    tagLine:
      "おめでとうございます、あなたはとてもハイレベルなReact Nativeのテンプレートを使ってます。このボイラープレートを活用してください！",
    reactotron: "Reactotronに送る",
    reportBugs: "バグをレポートする",
    demoList: "デモリスト",
    demoPodcastList: "デモのポッドキャストリスト",
    androidReactotronHint:
      "もし動かなければ、Reactotronのデスクトップアプリが実行されていることを確認して, このコマンドをターミナルで実行した後、アプリをアプリをリロードしてください。 adb reverse tcp:9090 tcp:9090",
    iosReactotronHint:
      "もし動かなければ、Reactotronのデスクトップアプリが実行されていることを確認して、アプリをリロードしてください。",
    macosReactotronHint:
      "もし動かなければ、Reactotronのデスクトップアプリが実行されていることを確認して、アプリをリロードしてください。",
    webReactotronHint:
      "もし動かなければ、Reactotronのデスクトップアプリが実行されていることを確認して、アプリをリロードしてください。",
    windowsReactotronHint:
      "もし動かなければ、Reactotronのデスクトップアプリが実行されていることを確認して、アプリをリロードしてください。",
  },
  demoPodcastListScreen: {
    title: "React Native Radioのエピソード",
    onlyFavorites: "お気に入り表示",
    favoriteButton: "お気に入り",
    unfavoriteButton: "お気に入りを外す",
    accessibility: {
      cardHint: "ダブルタップで再生します。 ダブルタップと長押しで {{action}}",
      switch: "スイッチオンでお気に入りを表示する",
      favoriteAction: "お気に入りの切り替え",
      favoriteIcon: "お気に入りのエピソードではありません",
      unfavoriteIcon: "お気に入りのエピソードです",
      publishLabel: "公開日 {{date}}",
      durationLabel: "再生時間: {{hours}} 時間 {{minutes}} 分 {{seconds}} 秒",
    },
    noFavoritesEmptyState: {
      heading: "どうやら空っぽのようですね",
      content:
        "お気に入りのエピソードがまだありません。エピソードにあるハートマークにタップして、お気に入りに追加しましょう！",
    },
  },

  ...demoJa,
}

export default ja
