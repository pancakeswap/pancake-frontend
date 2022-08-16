import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Text, Link, HelpIcon } from '@pancakeswap/uikit'
import { useSwitchNetwork } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

interface WalletWrongNetworkProps {
  onDismiss: () => void
}

const WalletWrongNetwork: React.FC<React.PropsWithChildren<WalletWrongNetworkProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { switchNetworkAsync } = useSwitchNetwork()

  const handleSwitchNetwork = async (): Promise<void> => {
    await switchNetworkAsync(ChainId.BSC)
    onDismiss?.()
  }

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      <Button onClick={handleSwitchNetwork} mb="24px">
        {t('Switch Network')}
      </Button>
      <StyledLink href="https://docs.pancakeswap.finance/get-started/connection-guide" external>
        <Button width="100%" variant="secondary">
          {t('Learn How')}
          <HelpIcon color="primary" ml="6px" />
        </Button>
      </StyledLink>
    </>
  )
}

export default WalletWrongNetwork
