import React, { useEffect, useState } from 'react'
import { sumBy } from 'lodash'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardHeader, Flex, Heading, PrizeIcon } from '@pancakeswap-libs/uikit'
import { useProfile } from 'state/hooks'
import { Achievement } from 'state/types'
import { addPoints } from 'state/profile'
import { addAchievement } from 'state/achievements'
import useI18n from 'hooks/useI18n'
import { getClaimableIfoData } from 'utils/achievements'
import AchievementRow from './AchievementRow'

const ClaimPointsCallout = () => {
  const [claimableAchievements, setClaimableAchievement] = useState<Achievement[]>([])
  const TranslateString = useI18n()
  const dispatch = useAppDispatch()
  const { profile } = useProfile()
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
    dispatch(addAchievement(achievement))
    dispatch(addPoints(achievement.points))

    setClaimableAchievement((prevClaimableAchievements) =>
      prevClaimableAchievements.filter((prevClaimableAchievement) => prevClaimableAchievement.id !== achievement.id),
    )
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
            <Heading size="lg">
              {TranslateString(999, `${totalPointsToCollect} Points to Collect`, { num: totalPointsToCollect })}
            </Heading>
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
