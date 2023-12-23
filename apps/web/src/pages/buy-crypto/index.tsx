import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import BuyCrypto from 'views/BuyCrypto'
import { fetchUserIp } from 'views/BuyCrypto/hooks/useProviderAvailability'
import { useQuery } from 'wagmi'

const BuyCryptoPage = ({ ip }) => {
  console.log(ip, 'ipp')
  const { data: userIp } = useQuery(['userIp'], () => fetchUserIp(), { initialData: null })
  return <BuyCrypto userIp={userIp} />
}

export async function getServerSideProps(context) {
  try {
    return {
      props: { ip: context.req.headers['x-forwarded-for'] },
    }
  } catch (error) {
    return {
      props: { ip: null }, // Pass null as the user IP if an error occurs
    }
  }
}

BuyCryptoPage.chains = SUPPORT_BUY_CRYPTO

export default BuyCryptoPage
