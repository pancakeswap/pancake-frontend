import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = () => {
  return <BuyCrypto />
}

BuyCryptoPage.chains = SUPPORT_BUY_CRYPTO

export default BuyCryptoPage
