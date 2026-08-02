import demoFr from "./demo-fr"
import { Translations } from "./en"

const fr: Translations = {
  common: {
    ok: "OK !",
    cancel: "Annuler",
    back: "Retour",
    logOut: "Déconnexion",
  },
  welcomeScreen: {
    postscript:
      "psst  — Ce n'est probablement pas à quoi ressemble votre application. (À moins que votre designer ne vous ait donné ces écrans, dans ce cas, mettez la en prod !)",
    readyForLaunch: "Votre application, presque prête pour le lancement !",
    exciting: "(ohh, c'est excitant !)",
    letsGo: "Allons-y !",
  },
  errorScreen: {
    title: "Quelque chose s'est mal passé !",
    friendlySubtitle:
      "C'est l'écran que vos utilisateurs verront en production lorsqu'une erreur sera lancée. Vous voudrez personnaliser ce message (situé dans `app/i18n/fr.ts`) et probablement aussi la mise en page (`app/screens/ErrorScreen`). Si vous voulez le supprimer complètement, vérifiez `app/app.tsx` pour le composant <ErrorBoundary>.",
    reset: "RÉINITIALISER L'APPLICATION",
    traceTitle: "Erreur depuis %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "Si vide... si triste",
      content:
        "Aucune donnée trouvée pour le moment. Essayez de cliquer sur le bouton pour rafraîchir ou recharger l'application.",
      button: "Essayons à nouveau",
    },
  },

  errors: {
    invalidEmail: "Adresse e-mail invalide.",
  },
  loginScreen: {
    logIn: "Se connecter",
    subtitle: "Bon retour, forgeron",
    usernameFieldLabel: "Nom d'utilisateur",
    usernameFieldPlaceholder: "Votre nom d'utilisateur",
    passwordFieldLabel: "Mot de passe",
    passwordFieldPlaceholder: "Entrez votre mot de passe",
    signInButton: "Se connecter",
    signingIn: "Connexion en cours...",
    emptyFields: "Veuillez saisir votre e-mail et votre mot de passe.",
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    passwordLength: "Le mot de passe doit contenir entre 8 et 72 caractères.",
    invalidCredentials: "E-mail ou mot de passe incorrect.",
    cannotConnect: "Impossible de se connecter au serveur. Vérifiez votre connexion.",
    serverError: "Erreur serveur. Veuillez réessayer plus tard.",
    loginFailed: "Échec de la connexion. Veuillez réessayer.",
    createAccountPrompt: "Pas encore de compte ?",
    createAccountLink: "Créer un compte",
    googleButton: "Continuer avec Gmail",
    facebookButton: "Continuer avec Facebook",
    signingInShort: "…",
    uiPreviewButton: "Continuer sans backend (UI)",
    settingsSoon: "Settings will be available soon.",
  },
  registerScreen: {
    title: "Créer un compte",
    subtitle: "Rejoignez Elite Forge et forgez votre légende sur le terrain.",
  },
  feedScreen: {
    title: "Feed",
    guestUser: "Joueur",
    openMenu: "Ouvrir le menu",
    composerPlaceholder: "Qu'avez-vous à partager ?",
    composerPhoto: "Photo",
    composerVideo: "Vidéo",
    composerMatch: "Match",
    composerSoon: "La publication sera bientôt disponible.",
    composeTitle: "Créer une publication",
    composePlaceholder: "Quoi de neuf ?",
    composePost: "Publier",
    composeCancel: "Annuler",
    composeAudience: "Visible par tous",
    shareTitle: "Partager la publication",
    shareFrom: "De {{name}}",
    shareCopyLink: "Copier le lien",
    shareSendFriends: "Envoyer aux amis",
    shareExternal: "Partager via…",
    like: "J'aime",
    comment: "Commenter",
    share: "Partager",
    likesCount: "{{count}} j'aime",
    commentsCount: "{{count}} commentaires",
    time2h: "2 h",
    time5h: "5 h",
    time1d: "1 j",
    time2d: "2 j",
    timeSponsored: "Sponsorisé",
    adBadge: "Officiel",
    adCta: "En savoir plus",
    adCtaLearn: "Rejoindre Elite Forge",
    adPost1: "Forgez votre légende. Entraînez-vous, jouez et connectez-vous.",
    adPost2: "Nouvelle saison, nouveaux objectifs. Découvrez les événements Elite Forge.",
    post1: "Super match aujourd'hui ! Rien de mieux qu'un terrain plein avec l'équipe.",
    post2: "Je cherche des milieux pour le 8v8 de dimanche. Qui est partant ?",
    post3: "Premier but de la saison. Le travail paie !",
    post4: "Séance d'entraînement d'hier. Chaque touche compte.",
  },
  feedDrawer: {
    sectionMenu: "Menu",
    profile: "Profil",
    groups: "Groupes",
    matches: "Matchs",
    reservations: "Réservations",
    comingSoon: "Bientôt",
    comingSoonTitle: "Bientôt disponible",
    profileSoon: "Votre profil sera bientôt disponible ici.",
    groupsSoon: "Les groupes seront bientôt disponibles ici.",
    matchesSoon: "Les matchs seront bientôt disponibles ici.",
    reservationsSoon: "Les réservations seront bientôt disponibles ici.",
  },
  demoNavigator: {
    componentsTab: "Composants",
    debugTab: "Débogage",
    communityTab: "Communauté",
    podcastListTab: "Podcasts",
  },
  demoCommunityScreen: {
    title: "Connectez-vous avec la communauté",
    tagLine:
      "Rejoignez la communauté d'ingénieurs React Native d'Infinite Red et améliorez votre développement d'applications avec nous !",
    joinUsOnSlackTitle: "Rejoignez-nous sur Slack",
    joinUsOnSlack:
      "Vous souhaitez vous connecter avec des ingénieurs React Native du monde entier ? Rejoignez la conversation dans la communauté Slack d'Infinite Red ! Notre communauté en pleine croissance est un espace sûr pour poser des questions, apprendre des autres et développer votre réseau.",
    joinSlackLink: "Rejoindre la communauté Slack",
    makeIgniteEvenBetterTitle: "Rendre Ignite encore meilleur",
    makeIgniteEvenBetter:
      "Vous avez une idée pour rendre Ignite encore meilleur ? Nous sommes heureux de l'entendre ! Nous cherchons toujours des personnes qui veulent nous aider à construire les meilleurs outils React Native. Rejoignez-nous sur GitHub pour nous aider à construire l'avenir d'Ignite.",
    contributeToIgniteLink: "Contribuer à Ignite",
    theLatestInReactNativeTitle: "Les dernières nouvelles de React Native",
    theLatestInReactNative:
      "Nous sommes là pour vous tenir au courant de tout ce que React Native a à offrir.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Conférence Chain React",
    hireUsTitle: "Engagez Infinite Red pour votre prochain projet",
    hireUs:
      "Que ce soit pour gérer un projet complet ou pour former des équipes à notre formation pratique, Infinite Red peut vous aider pour presque tous les projets React Native.",
    hireUsLink: "Envoyez-nous un message",
  },
  demoShowroomScreen: {
    jumpStart: "Composants pour démarrer votre projet !",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via la propriété `tx`",
    demoViaSpecifiedTxProp: "Via la propriété `{{prop}}Tx` spécifiée",
  },
  demoDebugScreen: {
    howTo: "COMMENT FAIRE",
    title: "Débugage",
    tagLine:
      "Félicitations, vous avez un modèle d'application React Native très avancé ici. Profitez de cette base de code !",
    reactotron: "Envoyer à Reactotron",
    reportBugs: "Signaler des bugs",
    demoList: "Liste de démonstration",
    demoPodcastList: "Liste de podcasts de démonstration",
    androidReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, exécutez adb reverse tcp:9090 tcp:9090 à partir de votre terminal, puis rechargez l'application.",
    iosReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
    macosReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
    webReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
    windowsReactotronHint:
      "Si cela ne fonctionne pas, assurez-vous que l'application de bureau Reactotron est en cours d'exécution, puis rechargez l'application.",
  },
  demoPodcastListScreen: {
    title: "Épisodes de Radio React Native",
    onlyFavorites: "Afficher uniquement les favoris",
    favoriteButton: "Favori",
    unfavoriteButton: "Non favori",
    accessibility: {
      cardHint:
        "Double-cliquez pour écouter l'épisode. Double-cliquez et maintenez pour {{action}} cet épisode.",
      switch: "Activez pour afficher uniquement les favoris",
      favoriteAction: "Basculer en favori",
      favoriteIcon: "Épisode non favori",
      unfavoriteIcon: "Épisode favori",
      publishLabel: "Publié le {{date}}",
      durationLabel: "Durée : {{hours}} heures {{minutes}} minutes {{seconds}} secondes",
    },
    noFavoritesEmptyState: {
      heading: "C'est un peu vide ici",
      content:
        "Aucun favori n'a été ajouté pour le moment. Appuyez sur le cœur d'un épisode pour l'ajouter à vos favoris !",
    },
  },

  ...demoFr,
}

export default fr
