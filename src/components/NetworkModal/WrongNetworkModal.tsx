import { Button, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import { useNetwork, Chain } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'
import Dots from '../Loader/Dots'

// Where page network is not equal to wallet network
export function WrongNetworkModal({ currentChain, onDismiss }: { currentChain: Chain; onDismiss: () => void }) {
  const { switchNetwork, isLoading } = useSwitchNetwork()
  const { chain } = useNetwork()
  const chainId = useLocalNetworkChain() || ChainId.BSC
  const { t } = useTranslation()

  const switchText = t('Switch to %network%', { network: currentChain.name })

  return (
    <Modal title={t('You are in wrong network')} headerBackground="gradients.cardHeader" onDismiss={onDismiss}>
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>{t('This page is located for %network%.', { network: currentChain.name })}</Text>
        <div style={{ textAlign: 'center' }}>
          <Image
            layout="fixed"
            width="194px"
            height="175px"
            src="/images/decorations/3d-pan-bunny.png"
            alt="check your network"
          />
        </div>
        <Message variant="warning">
          <MessageText>
            {t('You are under %network% now, please switch the network to continue.', { network: chain.name })}
          </MessageText>
        </Message>
        <Button isLoading={isLoading} onClick={() => switchNetwork(chainId)}>
          {isLoading ? <Dots>{switchText}</Dots> : switchText}
        </Button>
      </Grid>
    </Modal>
  )
}
