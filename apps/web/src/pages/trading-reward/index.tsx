const TradingRewardPage = () => <></>

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: '/trading-reward/cake-stakers',
      permanent: true,
    },
  }
}

export default TradingRewardPage
