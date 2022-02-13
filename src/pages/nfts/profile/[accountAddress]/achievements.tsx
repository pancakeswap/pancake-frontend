import { useRouter } from 'next/router'
import React from 'react'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Nft/market/Profile'
import Achievements from 'views/Nft/market/Profile/components/Achievements'

const NftProfileAchievementsPage = () => {
  const accountAddress = useRouter().query.accountAddress as string
  const { profile: profileHookState } = useProfileForAddress(accountAddress)
  const { profile } = profileHookState || {}
  const { achievements, isFetching: isAchievementFetching, refresh } = useAchievementsForAddress(accountAddress)

  return (
    <Achievements
      achievements={achievements}
      isLoading={isAchievementFetching}
      points={profile?.points}
      onSuccess={refresh}
    />
  )
}

NftProfileAchievementsPage.Layout = NftProfileLayout

export default NftProfileAchievementsPage
