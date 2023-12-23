import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = ({ userIp }) => {
  return <BuyCrypto userIp={userIp} />
}

export async function getInitialProps() {
  try {
    const response = await fetch(`${'https://pcs-on-ramp-api.com'}/user-ip`)
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

BuyCryptoPage.chains = SUPPORT_BUY_CRYPTO

export default BuyCryptoPage
