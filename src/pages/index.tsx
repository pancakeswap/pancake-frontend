import HomeDemo from 'views/HomeDemo'
import { ChainId } from '@pancakeswap/sdk'

const IndexPage = () => {
  return (
    <HomeDemo />
  )
}
IndexPage.chains = [ChainId.BSC, ChainId.BSC_TESTNET, ChainId.ETHW_MAINNET]



export default IndexPage
