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
  const { tokenId } = params

  const isNumberReg = /^\d+$/

  if (!(tokenId as string)?.match(isNumberReg)) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/add`,
      },
    }
  }

  return {
    props: {},
  }
}
