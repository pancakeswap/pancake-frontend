import React, { useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Flex } from '@pancakeswap-libs/uikit'
import { Achievement } from 'state/types'
import { useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { usePointCenterIfoContract } from 'hooks/useContract'
import ActionColumn from '../ActionColumn'
import PointsLabel from './PointsLabel'
import AchievementTitle from '../AchievementTitle'
import AchievementAvatar from '../AchievementAvatar'
import AchievementDescription from '../AchievementDescription'

interface AchievementRowProps {
  achievement: Achievement
  onCollectSuccess?: (achievement: Achievement) => void
}

const StyledAchievementRow = styled(Flex)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding-bottom: 16px;
  padding-top: 16px;
`

const Details = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;
  }
`

const AchievementRow: React.FC<AchievementRowProps> = ({ achievement, onCollectSuccess }) => {
  const [isCollecting, setIsCollecting] = useState(false)
  const TranslateString = useI18n()
  const pointCenterContract = usePointCenterIfoContract()
  const { account } = useWallet()
  const { toastError } = useToast()

  const handleCollectPoints = () => {
    pointCenterContract.methods
      .getPoints(achievement.address)
      .send({ from: account })
      .on('sending', () => {
        setIsCollecting(true)
      })
      .on('receipt', () => {
        setIsCollecting(false)
        onCollectSuccess(achievement)
      })
      .on('error', (error) => {
        toastError('Error', error?.message)
        setIsCollecting(false)
      })
  }

  return (
    <StyledAchievementRow>
      <AchievementAvatar badge={achievement.badge} />
      <Details>
        <div>
          <AchievementTitle title={achievement.title} />
          <AchievementDescription description={achievement.description} />
        </div>
        <PointsLabel points={achievement.points} />
      </Details>
      <ActionColumn>
        <Button
          onClick={handleCollectPoints}
          isLoading={isCollecting}
          endIcon={isCollecting ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={isCollecting}
          variant="secondary"
          fullWidth
        >
          {TranslateString(999, 'Collect')}
        </Button>
      </ActionColumn>
    </StyledAchievementRow>
  )
}

export default AchievementRow
