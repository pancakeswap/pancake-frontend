import { Image, Swap } from '@pancakeswap/uikit'
import { usePhishingBanner } from 'state/user/phishingBanner'
import NoSSR from 'components/NoSSR'

export const ExchangeLayout = ({ children }: React.PropsWithChildren) => {
  const [showPhishingBanner] = usePhishingBanner()

  return (
    <NoSSR>
      <Swap.Page
        helpUrl="https://docs.pancakeswap.finance/get-started-aptos"
        isEvm={false}
        helpImage={<Image src="/help.png" width={178} height={243} />}
        hasWarningBanner={showPhishingBanner}
      >
        {children}
      </Swap.Page>
    </NoSSR>
  )
}
