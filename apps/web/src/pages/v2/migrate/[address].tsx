import { ChainId } from '@pancakeswap/sdk'
import { AppHeader } from 'components/App'
import { BodyWrapper } from 'components/App/AppBody'
import { useRouter } from 'next/router'
import { isAddress } from 'utils'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { Migrate } from 'views/AddLiquidityV3/Migrate'
import Page from 'views/Page'

function MigratePage() {
  // const { t } = useTranslation()

  const router = useRouter()

  const address = isAddress(router.query.address)

  return (
    <LiquidityFormProvider>
      <Page>
        <BodyWrapper style={{ maxWidth: '858px' }}>
          <AppHeader title="Migrate Liquidity" />
          {address && <Migrate v2PairAddress={address} />}
        </BodyWrapper>
      </Page>
    </LiquidityFormProvider>
  )
}

export default MigratePage

MigratePage.chains = [ChainId.BSC, ChainId.ETHEREUM, ChainId.BSC_TESTNET, ChainId.GOERLI]
