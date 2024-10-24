import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Swap } from '@pancakeswap/widgets-internal'
import { EXCHANGE_HELP_URLS } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    helpUrl?: string
    showExternalLink?: boolean
    showHelpLink?: boolean
  }>
> = ({
  children,
  removePadding = false,
  hideFooterOnDesktop = false,
  noMinHeight = false,
  helpUrl = EXCHANGE_HELP_URLS,
  showExternalLink = true,
  showHelpLink = true,
  ...props
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const isBSC = chainId === ChainId.BSC
  const externalText = isBSC ? t('Bridge assets to BNB Chain') : ''
  const externalLinkUrl = isBSC ? 'https://bridge.pancakeswap.finance/' : ''

  return (
    <Swap.Page
      removePadding={removePadding}
      noMinHeight={noMinHeight}
      hideFooterOnDesktop={hideFooterOnDesktop}
      helpUrl={showHelpLink ? helpUrl : undefined}
      externalText={externalText}
      externalLinkUrl={showExternalLink ? externalLinkUrl : undefined}
      {...props}
    >
      {children}
    </Swap.Page>
  )
}

export default Page
