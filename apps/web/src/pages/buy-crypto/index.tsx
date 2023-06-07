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
    const response = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=a0d1165abb5d413685ba22de777116f5')
    const data = await response.json()
    const userIp = data.ip_address

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
