import { Box, InjectedModalProps } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback } from 'react'
import ConfirmSwapModalContainer from 'views/Swap/components/ConfirmSwapModalContainer'

type ConfirmSwapModalV2Props = InjectedModalProps & {
  customOnDismiss?: () => void
  onDismiss?: () => void
}

export const ConfirmSwapModalV2: React.FC<ConfirmSwapModalV2Props> = ({ customOnDismiss, onDismiss }) => {
  const { chainId } = useActiveChainId()
  const loadingAnimationVisible = false

  const handleDismiss = useCallback(() => {
    if (typeof customOnDismiss === 'function') {
      customOnDismiss()
    }

    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      headerPadding={loadingAnimationVisible ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={loadingAnimationVisible ? '0 24px 24px 24px' : '24px'}
      bodyTop={loadingAnimationVisible ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>top</Box>
    </ConfirmSwapModalContainer>
  )
}
