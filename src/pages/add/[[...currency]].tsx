import { GetStaticPaths } from 'next'
import AddLiquidity from 'views/AddLiquidity'

export default AddLiquidity

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps = async ({ params }) => {
  const { currency = [] } = params
  const [currencyIdA, currencyIdB] = currency
  const match = currencyIdA.match(OLD_PATH_STRUCTURE)

  if (match?.length) {
    return {
      redirect: {
        statusCode: 301,
        destination: `/add/${match[1]}/${match[2]}`,
      },
    }
  }

  if (currencyIdA?.toLowerCase() === currencyIdB?.toLowerCase()) {
    return {
      statusCode: 303,
      redirect: `/add/${match[1]}/${match[2]}`,
    }
  }

  return {
    props: {},
  }
}
