import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticProps } from 'next'
import Home from '../views/Home'

const IndexPage = () => {
  return <Home />
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  try {
    let results
    if (process.env.NODE_ENV === 'production') {
      results = await (await fetch('https://pancakeswap.finance/api/info')).json()
    } else {
      results = await (await fetch('http://localhost:3000/api/info')).json()
    }
    queryClient.setQueryData(['totalTx30Days'], results.totalTx30Days)
    queryClient.setQueryData(['tvl'], results.tvl)
    queryClient.setQueryData(['addressCount30Days'], results.addressCount30Days)
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
    }
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
