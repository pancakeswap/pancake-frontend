import React, { useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Flex } from '@pancakeswap/uikit'
import { Achievement } from 'state/types'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding-bottom: 16px;
  padding-top: 16px;
`

const Details = styled.div`
  flex: 1;
`

const Body = styled(Flex)`
  flex-direction: column;
  flex: 1;
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;
    flex-direction: row;
  }
`

const AchievementRow: React.FC<AchievementRowProps> = ({ achievement, onCollectSuccess }) => {
  const [isCollecting, setIsCollecting] = useState(false)
  const { t } = useTranslation()
  const pointCenterContract = usePointCenterIfoContract()
  const { toastError, toastSuccess } = useToast()

  const handleCollectPoints = async () => {
    const tx = await pointCenterContract.getPoints(achievement.address)
    setIsCollecting(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      setIsCollecting(false)
      onCollectSuccess(achievement)
      toastSuccess(t('Points Collected!'))
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsCollecting(false)
    }
  }

  return (
    <StyledAchievementRow>
      <AchievementAvatar badge={achievement.badge} />
      <Body>
        <Details>
          <AchievementTitle title={achievement.title} />
          <AchievementDescription description={achievement.description} />
        </Details>
        <PointsLabel points={achievement.points} px={[0, null, null, '32px']} mb={['16px', null, null, 0]} />
        <ActionColumn>
          <Button
            onClick={handleCollectPoints}
            isLoading={isCollecting}
            endIcon={isCollecting ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={isCollecting}
            variant="secondary"
          >
            {t('Collect')}
          </Button>
        </ActionColumn>
      </Body>
    </StyledAchievementRow>
  )
}

export default AchievementRow
