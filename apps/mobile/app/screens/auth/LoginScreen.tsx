import { FC, useCallback, useState } from "react"
import { KeyboardAvoidingView, Platform, StatusBar } from "react-native"
import { ScrollView, Text, XStack, YStack } from "tamagui"

import {
  AuthFormCard,
  Button,
  Divider,
  EliteForgeLogo,
  Input,
  LinkText,
  SocialButton,
} from "@/components/ui"
import { useAuth } from "@/context/AuthContext"
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout"
import { translate } from "@/i18n/translate"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { api } from "@/services/api"
import { eliteForgeColors } from "@/theme/eliteForgeColors"
import { openLinkInBrowser } from "@/utils/openLinkInBrowser"

type LoginScreenProps = AppStackScreenProps<"Login">

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SIGN_UP_URL = "https://sandybrown-pigeon-607893.hostingersite.com/auth/sign-up"

export const LoginScreen: FC<LoginScreenProps> = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { setAuthToken, setAuthEmail } = useAuth()

  const {
    insets,
    horizontalPadding,
    contentMaxWidth,
    sectionGap,
    isSmallScreen,
    keyboardVerticalOffset,
  } = useResponsiveLayout()

  /**
   * Inicia sesión contra el API Gateway (POST /api/auth/login).
   * El token se persiste en MMKV vía AuthContext; AppNavigator redirige a Welcome.
   */
  const handleLogin = useCallback(async () => {
    if (isLoading) return

    const email = username.trim()

    if (!email || !password) {
      setErrorMessage(translate("loginScreen:emptyFields"))
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage(translate("loginScreen:invalidEmail"))
      return
    }

    setErrorMessage("")
    setIsLoading(true)

    try {
      const response = await api.login(email, password)

      if (response.kind === "ok") {
        setAuthToken(response.accessToken)
        setAuthEmail(response.user.email)
        return
      }

      switch (response.kind) {
        case "unauthorized":
          setErrorMessage(translate("loginScreen:invalidCredentials"))
          break
        case "cannot-connect":
        case "timeout":
          setErrorMessage(translate("loginScreen:cannotConnect"))
          break
        case "server":
          setErrorMessage(translate("loginScreen:serverError"))
          break
        default:
          setErrorMessage(translate("loginScreen:loginFailed"))
      }
    } catch {
      setErrorMessage(translate("loginScreen:loginFailed"))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, password, setAuthEmail, setAuthToken, username])

  const handleCreateAccount = useCallback(() => {
    openLinkInBrowser(SIGN_UP_URL)
  }, [])

  return (
    <YStack flex={1} backgroundColor={eliteForgeColors.carbon}>
      <StatusBar barStyle="light-content" backgroundColor={eliteForgeColors.carbon} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          flex={1}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingTop: insets.top + (isSmallScreen ? 12 : 20),
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: horizontalPadding,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <YStack
            width="100%"
            maxWidth={contentMaxWidth}
            gap={sectionGap}
            alignItems="center"
            flex={1}
            justifyContent={isSmallScreen ? "flex-start" : "center"}
          >
            <EliteForgeLogo />

            <Text
              color="#FFFFFF"
              opacity={0.65}
              fontSize={isSmallScreen ? 13 : 14}
              textAlign="center"
            >
              {translate("loginScreen:subtitle")}
            </Text>

            <AuthFormCard>
              <YStack gap={isSmallScreen ? 14 : 16} padding={isSmallScreen ? 14 : 16}>
                <Input
                  label={translate("loginScreen:usernameFieldLabel")}
                  placeholder={translate("loginScreen:usernameFieldPlaceholder")}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text)
                    if (errorMessage) setErrorMessage("")
                  }}
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />

                <Input
                  label={translate("loginScreen:passwordFieldLabel")}
                  placeholder={translate("loginScreen:passwordFieldPlaceholder")}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text)
                    if (errorMessage) setErrorMessage("")
                  }}
                  secureTextEntry
                  autoComplete="password"
                />

                {errorMessage ? (
                  <Text
                    color="$efOrange"
                    fontSize={isSmallScreen ? 13 : 14}
                    textAlign="center"
                    accessibilityRole="alert"
                  >
                    {errorMessage}
                  </Text>
                ) : null}

                <Button width="100%" onPress={handleLogin} disabled={isLoading} opacity={isLoading ? 0.7 : 1}>
                  {isLoading
                    ? translate("loginScreen:signingIn")
                    : translate("loginScreen:signInButton")}
                </Button>

                <LinkText
                  prompt={translate("loginScreen:createAccountPrompt")}
                  linkLabel={translate("loginScreen:createAccountLink")}
                  onPress={handleCreateAccount}
                />
              </YStack>
            </AuthFormCard>

            <YStack width="100%" gap={isSmallScreen ? 10 : 12}>
              <Divider label={translate("loginScreen:continueWith")} />

              <XStack width="100%" gap={isSmallScreen ? 8 : 10}>
                <SocialButton
                  compact
                  provider="google"
                  label={translate("loginScreen:googleButton")}
                  compactLabel={translate("loginScreen:googleButtonShort")}
                  onPress={() => undefined}
                />

                <SocialButton
                  compact
                  provider="facebook"
                  label={translate("loginScreen:facebookButton")}
                  compactLabel={translate("loginScreen:facebookButtonShort")}
                  onPress={() => undefined}
                />
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </YStack>
  )
}
