import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import type { ProviderAvailabilititProps } from 'state/buyCrypto/reducer'
import { useAccount } from 'wagmi'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { StyledAppBody } from './styles'

export default function BuyCrypto({ providerAvailabilities }: ProviderAvailabilititProps) {
  const { address } = useAccount()
  useDefaultsFromURLSearch(address, providerAvailabilities)

  return (
    <Page>
      <StyledAppBody mb="24px">
        <BuyCryptoForm />
      </StyledAppBody>
      <StyledAppBody>
        <OnRampFaqs />
      </StyledAppBody>
    </Page>
  )
}
