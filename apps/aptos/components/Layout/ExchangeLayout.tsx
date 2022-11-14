import { Image, Swap } from '@pancakeswap/uikit'

export const ExchangeLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <Swap.Page
      helpUrl="https://docs.pancakeswap.finance/get-started-aptos"
      isBSC={false}
      helpImage={<Image src="/help.png" width={178} height={243} alt="Aptos help" />}
    >
      {children}
    </Swap.Page>
  )
}
