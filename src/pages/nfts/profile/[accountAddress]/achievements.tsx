import { useRouter } from 'next/router'
import React from 'react'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import { NftMarketLayout } from 'views/Nft/market/Layout'
import NftProfile from 'views/Nft/market/Profile'
import Achievements from 'views/Nft/market/Profile/components/Achievements'

const NftProfileAchievementsPage = () => {
  const accountAddress = useRouter().query.accountAddress as string
  const { profile: profileHookState } = useProfileForAddress(accountAddress)
  const { profile } = profileHookState || {}
  const { achievements, isFetching: isAchievementFetching } = useAchievementsForAddress(accountAddress)

  return (
    <NftProfile>
      <Achievements achievements={achievements} isLoading={isAchievementFetching} points={profile?.points} />
    </NftProfile>
  )
}

NftProfileAchievementsPage.getLayout = (page) => {
  return <>{NftMarketLayout(page)}</>
}

export default NftProfileAchievementsPage
