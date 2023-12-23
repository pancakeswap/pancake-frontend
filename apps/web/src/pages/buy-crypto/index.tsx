import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = ({ userIp }: { userIp: string | null }) => {
  return <BuyCrypto userIp={userIp ?? undefined} />
}

export async function getServerSideProps(context) {
  const userIp: string | null = context.req.headers['x-forwarded-for']
  return {
    props: { userIp },
  }
}

BuyCryptoPage.chains = SUPPORT_BUY_CRYPTO

export default BuyCryptoPage
