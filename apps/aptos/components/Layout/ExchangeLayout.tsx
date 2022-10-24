import { Image, Swap } from '@pancakeswap/uikit'

export const ExchangeLayout = ({ children }: React.PropsWithChildren) => (
  <Swap.Page
    helpUrl="https://docs.pancakeswap.finance/get-started-aptos"
    isEvm={false}
    helpImage={<Image src="/help.png" width={178} height={243} />}
  >
    {children}
  </Swap.Page>
)
