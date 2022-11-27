import { Swap } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    noMinHeight?: boolean
    helpUrl?: string
  }>
> = ({
  children,
  removePadding = false,
  noMinHeight = false,
  ...props
}) => {

  return (
    <>
      <PageMeta />
      <Swap.Page
        removePadding={removePadding}
        noMinHeight={noMinHeight}
        hideFooterOnDesktop
        {...props}
      >
        {children}
      </Swap.Page>
    </>
  )
}

export default Page
