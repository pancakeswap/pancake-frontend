import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, Flex, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Achievement } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePointCenterIfoContract } from 'hooks/useContract'
import { styled } from 'styled-components'
import { Address } from 'viem'
import AchievementAvatar from 'views/Profile/components/Achievements/AchievementAvatar'
import AchievementDescription from 'views/Profile/components/Achievements/AchievementDescription'
import AchievementTitle from 'views/Profile/components/Achievements/AchievementTitle'
import PointsLabel from './PointsLabel'

interface AchievementRowProps {
  achievement: Achievement
  onCollectSuccess?: (achievement: Achievement) => void
}

const ActionColumn = styled.div`
  flex: none;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 160px;

    & > button {
      width: 100%;
    }
  }
`

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

const AchievementRow: React.FC<React.PropsWithChildren<AchievementRowProps>> = ({ achievement, onCollectSuccess }) => {
  const { t } = useTranslation()
  const pointCenterContract = usePointCenterIfoContract()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isCollecting } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleCollectPoints = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(pointCenterContract, 'getPoints', [achievement.address as Address])
    })
    if (receipt?.status) {
      onCollectSuccess?.(achievement)
      toastSuccess(t('Points Collected!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
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
