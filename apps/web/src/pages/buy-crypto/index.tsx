import { CHAIN_IDS } from 'utils/wagmi'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = () => {
  return <BuyCrypto />
}

BuyCryptoPage.chains = CHAIN_IDS

export default BuyCryptoPage
