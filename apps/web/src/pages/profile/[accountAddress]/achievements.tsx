import { useRouter } from 'next/router'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Profile'
import Achievements from 'views/Profile/components/Achievements'

const NftProfileAchievementsPage = () => {
  const accountAddress = useRouter().query.accountAddress as string
  const { profile } = useProfileForAddress(accountAddress)
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
