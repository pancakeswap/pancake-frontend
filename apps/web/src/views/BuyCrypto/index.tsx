import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { useAccount } from 'wagmi'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { useFetchProviderAvailabilities } from './hooks/useProviderAvailabilities'
import { StyledAppBody } from './styles'

export default function BuyCrypto() {
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)

  const { data: providerAvailabilities } = useFetchProviderAvailabilities()
  return (
    <Page>
      <StyledAppBody mb="24px">
        <BuyCryptoForm providerAvailabilities={providerAvailabilities} />
      </StyledAppBody>
      <StyledAppBody>
        <OnRampFaqs />
      </StyledAppBody>
    </Page>
  )
}
