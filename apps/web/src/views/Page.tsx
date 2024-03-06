import { Swap } from '@pancakeswap/widgets-internal'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    noMinHeight?: boolean
  }>
> = ({ children, removePadding = false, noMinHeight = false, ...props }) => {
  return (
    <Swap.Page removePadding={removePadding} noMinHeight={noMinHeight} {...props}>
      {children}
    </Swap.Page>
  )
}

export default Page
