import { GetStaticPaths } from 'next'
import RemoveLiquidity from 'views/RemoveLiquidity'

export default RemoveLiquidity

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps = async ({ params }) => {
  const { currency = [] } = params

  if (currency.length === 1) {
    if (!OLD_PATH_STRUCTURE.test(currency)) {
      return {
        redirect: {
          statusCode: 307,
          destination: `/pool`,
        },
      }
    }

    const [currency0, currency1] = currency[0].split('-')
    return {
      statusCode: 307,
      redirect: `/remove/${currency0}/${currency1}`,
    }
  }

  return {
    props: {},
  }
}
