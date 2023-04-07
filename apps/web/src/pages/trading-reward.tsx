import { GetServerSideProps } from 'next'
import TradingReward from '../views/TradingReward'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { campaignId } = context.query

  if (!campaignId) {
    return {
      redirect: {
        statusCode: 307,
        destination: `/`,
      },
    }
  }

  return {
    props: {},
  }
}

export default TradingReward
