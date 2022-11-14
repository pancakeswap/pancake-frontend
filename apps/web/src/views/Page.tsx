import { Swap } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import { PageMeta } from 'components/Layout/Page'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { EXCHANGE_HELP_URLS } from 'config/constants'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    helpUrl?: string
  }>
> = ({
  children,
  removePadding = false,
  hideFooterOnDesktop = false,
  noMinHeight = false,
  helpUrl = EXCHANGE_HELP_URLS,
  ...props
}) => {
  const { chainId } = useActiveChainId()
  const isBSC = chainId === ChainId.BSC

  return (
    <>
      <PageMeta />
      <Swap.Page
        isBSC={isBSC}
        removePadding={removePadding}
        noMinHeight={noMinHeight}
        hideFooterOnDesktop={hideFooterOnDesktop}
        helpUrl={helpUrl}
        {...props}
      >
        {children}
      </Swap.Page>
    </>
  )
}

export default Page
