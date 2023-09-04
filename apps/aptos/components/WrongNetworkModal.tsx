import { useDisconnect } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { Button, HelpIcon, Link, Message, MessageText, Modal, ModalV2, Text } from '@pancakeswap/uikit'
import { useActiveNetwork } from 'hooks/useNetwork'
import { styled } from 'styled-components'

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

export const WrongNetworkModal: React.FC = () => {
  const { t } = useTranslation()
  const { isWrongNetwork } = useActiveNetwork()
  const { disconnect } = useDisconnect()

  return (
    <ModalV2 isOpen={isWrongNetwork}>
      <Modal title={t('Wrong Network')} hideCloseButton>
        <Text>{t('You’re connected to the wrong network.')}</Text>
        <Text mb="24px">
          {t('Please check your wallet app and make sure ’%network%’ is selected.', { network: 'Aptos Mainnet' })}
        </Text>
        <Message variant="danger" mb="24px">
          <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
        </Message>
        <StyledLink
          href="https://docs.pancakeswap.finance/get-started-aptos/connection-guide#connect-to-aptos-mainnet"
          external
        >
          <Button width="100%" variant="secondary">
            {t('Learn How')}
            <HelpIcon color="primary" ml="6px" />
          </Button>
        </StyledLink>
        <Button mt="24px" onClick={() => disconnect()}>
          {t('Disconnect Wallet')}
        </Button>
      </Modal>
    </ModalV2>
  )
}
