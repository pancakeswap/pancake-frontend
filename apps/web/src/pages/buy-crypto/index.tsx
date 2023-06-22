import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { CHAIN_IDS } from 'utils/wagmi'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = ({ userIp }) => {
  return <BuyCrypto userIp={userIp} />
}

export async function getServerSideProps() {
  try {
    const response = await fetch(`${ONRAMP_API_BASE_URL}/user-ip`)
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
