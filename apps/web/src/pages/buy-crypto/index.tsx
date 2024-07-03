import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import type { ProviderAvailabilities, ProviderAvailabilititProps } from 'state/buyCrypto/reducer'
import { CHAIN_IDS } from 'utils/wagmi'
import BuyCrypto from 'views/BuyCrypto'

const BuyCryptoPage = ({ providerAvailabilities }: ProviderAvailabilititProps) => {
  return <BuyCrypto providerAvailabilities={providerAvailabilities} />
}

export const getServerSideProps = async ({ req, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=59')

  const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-provider-availability`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = await response.json()
  const providerAvailabilities = result.result as ProviderAvailabilities

  return {
    props: {
      providerAvailabilities,
    },
  }
}

BuyCryptoPage.chains = CHAIN_IDS

export default BuyCryptoPage
