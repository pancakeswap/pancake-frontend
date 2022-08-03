import { Button, Grid, Message, MessageText, Modal, Text } from '@pancakeswap/uikit'
import { useLocalNetworkChain } from 'hooks/useActiveWeb3React'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Image from 'next/image'
import { ChainId } from '@pancakeswap/sdk'
import Dots from './Loader/Dots'

export function WrongNetworkModal() {
  const { switchNetwork, isLoading } = useSwitchNetwork()
  const chainId = useLocalNetworkChain() || ChainId.BSC
  return (
    <Modal title="Check your network" hideCloseButton headerBackground="gradients.cardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Text>Currently exchange only supported in BNB Smart Chain, Ethereum.</Text>
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
          <MessageText>Please switch your network to continue.</MessageText>
        </Message>
        <Button isLoading={isLoading} onClick={() => switchNetwork(chainId)}>
          {isLoading ? <Dots>Switch network in wallet</Dots> : 'Switch network in wallet'}
        </Button>
      </Grid>
    </Modal>
  )
}
