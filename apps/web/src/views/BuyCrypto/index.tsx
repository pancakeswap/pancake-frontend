import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { useAccount } from 'wagmi'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { StyledAppBody } from './styles'

export default function BuyCrypto() {
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)

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
