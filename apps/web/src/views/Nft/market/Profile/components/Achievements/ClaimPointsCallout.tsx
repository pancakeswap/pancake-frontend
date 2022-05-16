import { useEffect, useState } from 'react'
import sumBy from 'lodash/sumBy'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardHeader, Flex, Heading, PrizeIcon } from '@pancakeswap/uikit'
import { useProfile } from 'state/profile/hooks'
import { Achievement } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getClaimableIfoData } from 'utils/achievements'
import AchievementRow from './AchievementRow'

const ClaimPointsCallout: React.FC<{ onSuccess?: () => void }> = ({ onSuccess = null }) => {
  const [claimableAchievements, setClaimableAchievement] = useState<Achievement[]>([])
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { profile, refresh: refreshProfile } = useProfile()
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchIfoClaims = async () => {
      const ifoData = await getClaimableIfoData(account)
      setClaimableAchievement(ifoData)
    }

    if (account) {
      fetchIfoClaims()
    }
  }, [account, dispatch, setClaimableAchievement])

  const handleCollectSuccess = (achievement: Achievement) => {
    refreshProfile()
    setClaimableAchievement((prevClaimableAchievements) =>
      prevClaimableAchievements.filter((prevClaimableAchievement) => prevClaimableAchievement.id !== achievement.id),
    )
    if (onSuccess) {
      onSuccess()
    }
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
