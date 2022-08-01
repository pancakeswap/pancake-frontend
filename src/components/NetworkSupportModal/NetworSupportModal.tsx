import { Button, Modal, Text, Grid, InjectedModalProps } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

export function NetworkSupportModal({ title, onDismiss }: InjectedModalProps & { title?: React.ReactNode }) {
  const { switchNetwork } = useSwitchNetwork()
  return (
    <Modal title={title} hideCloseButton>
      <Grid style={{ gap: '16px' }}>
        <Text>It’s a BNB smart chain only feature</Text>
        <Button onClick={() => switchNetwork(ChainId.BSC).then(() => onDismiss?.())}>Switch to BNB Smart Chain</Button>
      </Grid>
    </Modal>
  )
}
