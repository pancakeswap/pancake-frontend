import { GetStaticPaths } from 'next'
import RemoveLiquidity from 'views/RemoveLiquidity'

export default RemoveLiquidity

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
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

    const split = currency[0].split('-')
    if (split.length > 1) {
      const [currency0, currency1] = split
      return {
        redirect: {
          statusCode: 307,
          destination: `/remove/${currency0}/${currency1}`,
        },
      }
    }
  }

  return {
    props: {},
  }
}
