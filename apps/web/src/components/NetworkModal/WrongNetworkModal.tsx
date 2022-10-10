import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { ArrowForwardIcon, Button, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { FlexGap } from 'components/Layout/Flex'
import { ChainLogo } from 'components/Logo/ChainLogo'
import useAuth from 'hooks/useAuth'
import { useSessionChainId } from 'hooks/useSessionChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/future/image'
import { Chain, useAccount, useNetwork } from 'wagmi'
import Dots from '../Loader/Dots'

// Where page network is not equal to wallet network
export function WrongNetworkModal({ currentChain, onDismiss }: { currentChain: Chain; onDismiss: () => void }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { logout } = useAuth()
  const { isConnected } = useAccount()
  const [, setSessionChainId] = useSessionChainId()
  const chainId = currentChain.id || ChainId.BSC
  const { t } = useTranslation()

  const switchText = t('Switch to %network%', { network: currentChain.name })

  return (
    <Modal title={t('You are in wrong network')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>{t('This page is located for %network%.', { network: currentChain.name })}</Text>
        <Text>
          {t('You are under %network% now, please switch the network to continue.', { network: chain?.name ?? '' })}
        </Text>
        <div style={{ textAlign: 'center' }}>
          <Image width={184} height={140} src="/images/decorations/3d-pan-bunny.png" alt="check your network" />
        </div>
        <Message variant="warning" icon={false} p="8px 12px">
          <MessageText>
            <FlexGap gap="12px">
              <FlexGap gap="6px">
                <ChainLogo chainId={chain?.id} /> <ArrowForwardIcon color="#D67E0A" />
                <ChainLogo chainId={chainId} />
              </FlexGap>
              <span>{t('Switch network to continue.')}</span>
            </FlexGap>
          </MessageText>
        </Message>
        {canSwitch ? (
          <Button isLoading={isLoading} onClick={() => switchNetworkAsync(chainId)}>
            {isLoading ? <Dots>{switchText}</Dots> : switchText}
          </Button>
        ) : (
          <Message variant="danger">
            <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
          </Message>
        )}
        {isConnected && (
          <Button
            onClick={() =>
              logout().then(() => {
                setSessionChainId(chainId)
              })
            }
            variant="secondary"
          >
            {t('Disconnect Wallet')}
          </Button>
        )}
      </Grid>
    </Modal>
  )
}
