import { useCallback, useState } from "react"
import { StatusBar } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { YStack } from "tamagui"

import { MOCK_FEED_POSTS, type FeedPost } from "@/data/mockFeedPosts"
import { useAuth } from "@/context/AuthContext"
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout"
import { isRTL } from "@/i18n"
import { eliteForgeColors } from "@/theme/eliteForgeColors"

import { FeedComposeModal } from "./components/FeedComposeModal"
import { FeedComposer } from "./components/FeedComposer"
import { FeedDrawer, type FeedDrawerItemId } from "./components/FeedDrawer"
import { FeedNavbar } from "./components/FeedNavbar"
import { FeedPostCard } from "./components/FeedPostCard"
import { FeedShareSheet } from "./components/FeedShareSheet"
import { openProfile, showFeedComingSoon } from "./feedNavigation"

export function FeedScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [sharePost, setSharePost] = useState<FeedPost | null>(null)
  const { logout } = useAuth()
  const { horizontalPadding, insets, contentMaxWidth } = useResponsiveLayout()
  const scrollY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

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
    setComposeOpen(true)
  }, [])

  const handleShare = useCallback((post: FeedPost) => {
    setSharePost(post)
  }, [])

  const renderPost = useCallback(
    ({ item }: { item: FeedPost }) => {
      return <FeedPostCard post={item} onShare={handleShare} />
    },
    [handleShare],
  )

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
          <FeedNavbar
            onMenuPress={openDrawer}
            onProfilePress={handleProfilePress}
            scrollY={scrollY}
          />

          <Animated.FlatList
            data={MOCK_FEED_POSTS}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
            ListHeaderComponent={listHeader}
            onScroll={onScroll}
            scrollEventThrottle={16}
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

      <FeedComposeModal visible={composeOpen} onClose={() => setComposeOpen(false)} />
      <FeedShareSheet
        visible={sharePost !== null}
        authorName={sharePost?.authorName}
        onClose={() => setSharePost(null)}
      />
    </YStack>
  )
}
