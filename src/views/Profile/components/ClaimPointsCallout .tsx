import React, { useEffect, useState } from 'react'
import { sumBy } from 'lodash'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Card, CardBody, CardHeader, Flex, Heading, PrizeIcon } from '@pancakeswap-libs/uikit'
import { Achievement } from 'state/types'
import { addAchievement } from 'state/achievements'
import useI18n from 'hooks/useI18n'
import { getClaimableIfoData } from 'utils/achievements'
import AchievementRow from './AchievementRow'
import ActionColumn from './ActionColumn'

const ClaimPointsCallout = () => {
  const [claimableAchievements, setClaimableAchievement] = useState<Achievement[]>([])
  const TranslateString = useI18n()
  const dispatch = useDispatch()
  const { account } = useWallet()

  useEffect(() => {
    const fetchIfoClaims = async () => {
      const ifoData = await getClaimableIfoData(account)
      setClaimableAchievement(ifoData)
    }

    if (account) {
      fetchIfoClaims()
    }
  }, [account, dispatch, setClaimableAchievement])

  /* eslint-disable no-alert */
  const donottry = () => alert("Don't even try Chungus")

  const handleCollectSuccess = (achievement: Achievement) => {
    dispatch(addAchievement(achievement))
    setClaimableAchievement((prevClaimableAchievements) =>
      prevClaimableAchievements.filter((prevClaimableAchievement) => prevClaimableAchievement.id !== achievement.id),
    )
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
          <ActionColumn>
            <Button fullWidth onClick={donottry}>
              {TranslateString(999, 'Collect All')}
            </Button>
          </ActionColumn>
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
