import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { targetChains } from 'config/supportedChain'
import { styled } from 'styled-components'
import { chainNameConverter } from 'utils/chainNameConverter'

const StyledChainList = styled(Flex)`
  padding: 10px 20px;
  cursor: pointer;
  margin-left: -24px;
  width: calc(100% + 48px);

  &:hover {
    background: ${({ theme }) => theme.colors.dropdown};
  }
`

const StyledContainer = styled(Flex)`
  height: calc(100% + 48px);
  margin-top: -24px;
`

interface NetworkSelectorModalProps extends InjectedModalProps {
  customSupportChains?: any
  pickedChainId: ChainId
  setPickedChainId: (chainId: ChainId) => void
}

export const NetworkSelectorModal: React.FC<React.PropsWithChildren<NetworkSelectorModalProps>> = ({
  customSupportChains,
  pickedChainId,
  setPickedChainId,
  onDismiss,
}) => {
  const { t } = useTranslation()

  const onClickNetwork = (chainId: ChainId) => {
    setPickedChainId(chainId)
    onDismiss?.()
  }

  return (
    <Modal title={t('Select a Network')} onDismiss={onDismiss}>
      <StyledContainer flexDirection="column" width={['100%', '100%', '100%', '280px']}>
        {(customSupportChains || targetChains).map((chain) => (
          <StyledChainList key={chain.id} onClick={() => onClickNetwork(chain.id)}>
            <ChainLogo chainId={chain.id} />
            <Text color={chain.id === pickedChainId ? 'secondary' : 'text'} bold={chain.id === pickedChainId} pl="12px">
              {chainNameConverter(chain.name)}
            </Text>
          </StyledChainList>
        ))}
      </StyledContainer>
    </Modal>
  )
}
