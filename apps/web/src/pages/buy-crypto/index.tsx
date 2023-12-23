import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import BuyCrypto from 'views/BuyCrypto'
import { fetchUserIp } from 'views/BuyCrypto/hooks/useProviderAvailability'
import { useQuery } from 'wagmi'

const BuyCryptoPage = ({ userIIp }) => {
  console.log(userIIp)
  const { data: userIp } = useQuery(['userIp'], () => fetchUserIp(), { initialData: null })
  return <BuyCrypto userIp={userIp} />
}

export async function getStaticProps() {
  try {
    const response = await fetch(`${'https://pcs-on-ramp-api.com'}/user-ip`)
    const data = await response.json()
    const userIIp = data.ipAddress

    return {
      props: { userIIp },
    }
  } catch (error) {
    return {
      props: { userIIp: null }, // Pass null as the user IP if an error occurs
    }
  }
}

BuyCryptoPage.chains = SUPPORT_BUY_CRYPTO

export default BuyCryptoPage
