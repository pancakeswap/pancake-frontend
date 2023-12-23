import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import BuyCrypto from 'views/BuyCrypto'
import { fetchUserIp } from 'views/BuyCrypto/hooks/useProviderAvailability'
import { useQuery } from 'wagmi'

const BuyCryptoPage = () => {
  const { data: userIp } = useQuery(['userIp'], () => fetchUserIp(), { initialData: null })
  return <BuyCrypto userIp={userIp} />
}

BuyCryptoPage.chains = SUPPORT_BUY_CRYPTO

export default BuyCryptoPage
