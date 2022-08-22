import { Button, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import { useNetwork } from 'wagmi'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import Dots from '../Loader/Dots'

// Where chain is not supported
export function UnsupportedNetworkModal() {
  const { switchNetwork, isLoading } = useSwitchNetwork()
  const { chains } = useNetwork()
  const chainId = useLocalNetworkChain() || ChainId.BSC
  const { t } = useTranslation()

  const supportedMainnetChains = useMemo(() => chains.filter((chain) => !chain.testnet), [chains])

  return (
    <Modal title={t('Check your network')} hideCloseButton headerBackground="gradients.cardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>
          {t('Currently exchange only supported in')} {supportedMainnetChains?.map((c) => c.name).join(', ')}
        </Text>
        <div style={{ textAlign: 'center' }}>
          <Image
            layout="fixed"
            width="194px"
            height="175px"
            src="/images/check-your-network.png"
            alt="check your network"
          />
        </div>
        <Message variant="warning">
          <MessageText>{t('Please switch your network to continue.')}</MessageText>
        </Message>
        <Button isLoading={isLoading} onClick={() => switchNetwork(chainId)}>
          {isLoading ? <Dots>{t('Switch network in wallet')}</Dots> : t('Switch network in wallet')}
        </Button>
      </Grid>
    </Modal>
  )
}
