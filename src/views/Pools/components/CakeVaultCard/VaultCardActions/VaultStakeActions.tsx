import { Button, Flex, Skeleton, useModal, Box, TooltipText, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from 'contexts/Localization'

import { DeserializedPool } from 'state/types'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'
import HasSharesActions from './HasSharesActions'

interface VaultStakeActionsProps {
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  accountHasSharesStaked: boolean
  performanceFee: number
  isLoading?: boolean
}

const VaultStakeActions: React.FC<VaultStakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  accountHasSharesStaked,
  performanceFee,
  isLoading = false,
}) => {
  const { stakingToken } = pool
  const { t } = useTranslation()
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} performanceFee={performanceFee} />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      {t(
        'Flexible staking offers flexibility for staking/unstaking whenever you want. Locked staking offers higher APY as well as other benefits.',
      )}
    </Box>,
    { placement: 'right' },
  )

  const renderStakeAction = () => {
    return accountHasSharesStaked ? (
      <HasSharesActions pool={pool} stakingTokenBalance={stakingTokenBalance} performanceFee={performanceFee} />
    ) : (
      <Box>
        <FlexGap gap="12px">
          <Button style={{ flex: 1 }} onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
            {t('Flexible')}
          </Button>
          <Button style={{ flex: 1 }} disabled>
            {t('Locked')}
          </Button>
        </FlexGap>
        {tooltipVisible && tooltip}
        <TooltipText mt="16px" small ref={targetRef}>
          {t('What’s the difference?')}
        </TooltipText>
      </Box>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default VaultStakeActions
