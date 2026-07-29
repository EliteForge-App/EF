import { useCallback, useState } from "react"
import { Alert, FlatList, StatusBar } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { YStack } from "tamagui"

import { useAuth } from "@/context/AuthContext"
import { MOCK_FEED_POSTS, type FeedPost } from "@/data/mockFeedPosts"
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout"
import { isRTL } from "@/i18n"
import { translate } from "@/i18n/translate"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

import { FeedComposer } from "./components/FeedComposer"
import { FeedDrawer, type FeedDrawerItemId } from "./components/FeedDrawer"
import { FeedNavbar } from "./components/FeedNavbar"
import { FeedPostCard } from "./components/FeedPostCard"
import { openProfile, showFeedComingSoon } from "./feedNavigation"

export function FeedScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { logout } = useAuth()
  const { horizontalPadding, insets, contentMaxWidth } = useResponsiveLayout()

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const handleDrawerItem = useCallback(
    (id: FeedDrawerItemId) => {
      closeDrawer()
      showFeedComingSoon(id)
    },
    [closeDrawer],
  )

  const handleProfilePress = useCallback(() => {
    openProfile()
  }, [])

  const handleLogout = useCallback(() => {
    closeDrawer()
    logout()
  }, [closeDrawer, logout])

  const handleComposerPress = useCallback(() => {
    Alert.alert(translate("feedDrawer:comingSoonTitle"), translate("feedScreen:composerSoon"))
  }, [])

  const renderPost = useCallback(({ item }: { item: FeedPost }) => {
    return <FeedPostCard post={item} />
  }, [])

  const listHeader = useCallback(
    () => (
      <YStack width="100%" maxWidth={contentMaxWidth} alignSelf="center">
        <FeedComposer onPress={handleComposerPress} />
      </YStack>
    ),
    [contentMaxWidth, handleComposerPress],
  )

  return (
    <YStack flex={1} backgroundColor={eliteForgeColors.carbon}>
      <StatusBar barStyle="light-content" backgroundColor={eliteForgeColors.carbon} />

      <Drawer
        open={drawerOpen}
        onOpen={openDrawer}
        onClose={closeDrawer}
        drawerPosition={isRTL ? "right" : "left"}
        drawerType="front"
        drawerStyle={{ width: "82%" }}
        renderDrawerContent={() => (
          <FeedDrawer
            onClose={closeDrawer}
            onItemPress={handleDrawerItem}
            onLogout={handleLogout}
          />
        )}
      >
        <YStack flex={1} paddingTop={insets.top}>
          <FeedNavbar onMenuPress={openDrawer} onProfilePress={handleProfilePress} />

          <FlatList
            data={MOCK_FEED_POSTS}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
            ListHeaderComponent={listHeader}
            contentContainerStyle={{
              paddingHorizontal: horizontalPadding,
              paddingTop: 12,
              paddingBottom: insets.bottom + 24,
              maxWidth: contentMaxWidth,
              width: "100%",
              alignSelf: "center",
            }}
            showsVerticalScrollIndicator={false}
          />
        </YStack>
      </Drawer>
    </YStack>
  )
}
