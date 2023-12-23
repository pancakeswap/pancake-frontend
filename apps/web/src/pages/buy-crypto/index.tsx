import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = ({ userIp, error }) => {
  console.log(userIp, error)
  return <BuyCrypto userIp={userIp} />
}

export async function getServerSideProps() {
  try {
    const response = await fetch(`${ONRAMP_API_BASE_URL}/user-ip`)
    const data = await response.json()
    const userIp = data.ipAddress

    return {
      props: { userIp, error: undefined },
    }
  } catch (error) {
    return {
      props: { userIp: null, error }, // Pass null as the user IP if an error occurs
    }
  }
}

BuyCryptoPage.chains = SUPPORT_BUY_CRYPTO

export default BuyCryptoPage
