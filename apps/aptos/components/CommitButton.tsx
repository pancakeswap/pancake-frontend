import { Button, ButtonProps } from '@pancakeswap/uikit'
// import { Trans } from '@pancakeswap/localization'
import { useAccount } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'
import { ConnectWalletButton } from './ConnectWalletButton'
// import { useSwitchNetworkLoading } from 'hooks/useSwitchNetworkLoading'
// import { useSetAtom } from 'jotai'
// import { useActiveChainId } from 'hooks/useActiveChainId'
// import { hideWrongNetworkModalAtom } from './NetworkModal'

// const wrongNetworkProps: ButtonProps = {
//   variant: 'danger',
//   disabled: false,
//   children: <Trans>Wrong Network</Trans>,
// }

export const CommitButton = (props: ButtonProps) => {
  // const { isWrongNetwork } = useActiveChainId()
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  // const [switchNetworkLoading] = useSwitchNetworkLoading()
  // const setHideWrongNetwork = useSetAtom(hideWrongNetworkModalAtom)

  if (!isConnected && isMounted) {
    return <ConnectWalletButton />
  }

  return (
    <Button
      {...props}
      onClick={(e) => {
        // if (isWrongNetwork) {
        //   setHideWrongNetwork(false)
        // } else {
        props.onClick?.(e)
        // }
      }}
      // {...(switchNetworkLoading && { disabled: true })}
      // {...(isWrongNetwork && wrongNetworkProps)}
    />
  )
}
