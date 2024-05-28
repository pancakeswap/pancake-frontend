import { useTranslation } from '@pancakeswap/localization'
import { Card, CardBody, CardHeader, Flex, Heading, PrizeIcon } from '@pancakeswap/uikit'
import { Achievement } from 'config/constants/types'
import { useProfile } from 'hooks/useProfile'
import sumBy from 'lodash/sumBy'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { getClaimableIfoData } from 'utils/achievements'
import { useAccount } from 'wagmi'
import AchievementRow from './AchievementRow'

const ClaimPointsCallout: React.FC<React.PropsWithChildren<{ onSuccess?: () => void }>> = ({ onSuccess = null }) => {
  const [claimableAchievements, setClaimableAchievement] = useState<Achievement[]>([])
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { profile, refresh: refreshProfile } = useProfile()
  const { address: account } = useAccount()

  useEffect(() => {
    const fetchIfoClaims = async () => {
      const ifoData = await getClaimableIfoData(account!, t)
      setClaimableAchievement(ifoData)
    }

    if (account) {
      fetchIfoClaims()
    }
  }, [account, dispatch, setClaimableAchievement, t])

  const handleCollectSuccess = (achievement: Achievement) => {
    refreshProfile()
    setClaimableAchievement((prevClaimableAchievements) =>
      prevClaimableAchievements.filter((prevClaimableAchievement) => prevClaimableAchievement.id !== achievement.id),
    )
    onSuccess?.()
  }

  if (!profile?.isActive) {
    return null
  }

  if (claimableAchievements.length === 0) {
    return null
  }

  const totalPointsToCollect = sumBy(claimableAchievements, 'points')

  return (
    <Card isActive mb="32px">
      <CardHeader>
        <Flex flexDirection={['column', null, 'row']} justifyContent={['start', null, 'space-between']}>
          <Flex alignItems="center" mb={['16px', null, 0]}>
            <PrizeIcon width="32px" mr="8px" />
            <Heading scale="lg">{t('%num% Points to Collect', { num: totalPointsToCollect })}</Heading>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        {claimableAchievements.map((achievement) => (
          <AchievementRow key={achievement.address} achievement={achievement} onCollectSuccess={handleCollectSuccess} />
        ))}
      </CardBody>
    </Card>
  )
}

export default ClaimPointsCallout
