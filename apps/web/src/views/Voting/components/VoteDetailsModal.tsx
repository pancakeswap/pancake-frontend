import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, InjectedModalProps, Modal, Spinner } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { VECAKE_VOTING_POWER_BLOCK } from '../helpers'
import useGetVotingPower from '../hooks/useGetVotingPower'
import DetailsView from './CastVoteModal/DetailsView'
import { VeMainView } from './CastVoteModal/MainView'

interface VoteDetailsModalProps extends InjectedModalProps {
  block: number
}

const VoteDetailsModal: React.FC<React.PropsWithChildren<VoteDetailsModalProps>> = ({ block, onDismiss }) => {
  const { t } = useTranslation()
  const {
    isLoading,
    total,
    cakeBalance,
    cakeVaultBalance,
    cakePoolBalance,
    poolsBalance,
    cakeBnbLpBalance,
    ifoPoolBalance,
    lockedCakeBalance,
    lockedEndTime,
    veCakeBalance,
  } = useGetVotingPower(block)
  const { theme } = useTheme()

  const handleDismiss = () => {
    onDismiss?.()
  }

  return (
    <Modal title={t('Voting Power')} onDismiss={handleDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <Box mb="24px" width={['100%', '100%', '100%', '320px']}>
        {isLoading ? (
          <Flex height="450px" alignItems="center" justifyContent="center">
            <Spinner size={80} />
          </Flex>
        ) : (
          <>
            {!block || BigInt(block) >= VECAKE_VOTING_POWER_BLOCK ? (
              <VeMainView block={block} total={total} veCakeBalance={veCakeBalance} />
            ) : (
              <DetailsView
                total={total}
                cakeBalance={cakeBalance}
                cakeVaultBalance={cakeVaultBalance}
                cakePoolBalance={cakePoolBalance}
                poolsBalance={poolsBalance}
                ifoPoolBalance={ifoPoolBalance}
                cakeBnbLpBalance={cakeBnbLpBalance}
                lockedCakeBalance={lockedCakeBalance}
                lockedEndTime={lockedEndTime}
                block={block}
              />
            )}
            <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
              {t('Close')}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal
