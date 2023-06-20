import { CHAIN_IDS } from 'utils/wagmi'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = ({ userIp }) => {
  return (
    <>
      <BuyCrypto userIp={userIp} />
    </>
  )
}

export async function getServerSideProps() {
  try {
    const response = await fetch('https://pcs-onramp-api.com/user-ip')
    const data = await response.json()
    const userIp = data.ipAddress

    return {
      props: { userIp },
    }
  } catch (error) {
    return {
      props: { userIp: null }, // Pass null as the user IP if an error occurs
    }
  }
}

BuyCryptoPage.chains = CHAIN_IDS

export default BuyCryptoPage
