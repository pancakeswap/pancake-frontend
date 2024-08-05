import { useAchievementsForAddress, useProfileForAddress } from 'hooks/useProfile'
import Achievements from 'views/Profile/components/Achievements'
import { useAccount } from 'wagmi'

export const AchievementsPage = () => {
  const { address: account } = useAccount()
  const accountAddress = account?.toLowerCase() as string
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
