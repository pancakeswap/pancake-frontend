import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { useProviderAvailabilities } from './hooks/useProviderAvailabilities'
import { StyledAppBody } from './styles'

export default function BuyCrypto() {
  useDefaultsFromURLSearch()
  const { data: providerAvailabilities } = useProviderAvailabilities()
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
