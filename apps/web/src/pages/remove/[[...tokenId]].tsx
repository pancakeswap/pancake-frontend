import { GetStaticPaths, GetStaticProps } from 'next'
import { CHAIN_IDS } from 'utils/wagmi'
import RemoveLiquidityFormProvider from 'views/RemoveLiquidity/form/RemoveLiquidityFormProvider'
import RemoveLiquidity from 'views/RemoveLiquidity/RemoveLiquidityV3'

const RemoveLiquidityPage = () => {
  return (
    <RemoveLiquidityFormProvider>
      <RemoveLiquidity />
    </RemoveLiquidityFormProvider>
  )
}

RemoveLiquidityPage.chains = CHAIN_IDS

export default RemoveLiquidityPage

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tokenId = (params.tokenId as string[]) || []

  if (tokenId.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {},
  }
}
