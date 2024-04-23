import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticProps } from 'next'
import Home from '../views/Home'

const IndexPage = () => {
  return <Home />
}

// Values fetched from TheGraph and BitQuery jan 24, 2022
const txCount = 54780336
const addressCount = 4425459
const tvl = 6082955532.115718

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  let results = {
    totalTx30Days: txCount,
    addressCount30Days: addressCount,
    tvl,
  }
  try {
    if (process.env.NODE_ENV === 'production') {
      results = await (await fetch('https://pancakeswap.finance/api/info')).json()
    } else {
      results = await (await fetch('http://localhost:3000/api/info')).json()
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
    }
    queryClient.setQueryData(['totalTx30Days'], results.totalTx30Days)
    queryClient.setQueryData(['tvl'], results.tvl)
    queryClient.setQueryData(['addressCount30Days'], results.addressCount30Days)
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60, // 1 hour
  }
}

IndexPage.chains = []
IndexPage.isShowV4IconButton = true

export default IndexPage
