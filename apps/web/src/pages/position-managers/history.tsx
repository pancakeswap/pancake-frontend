import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/position-managers'

import { PositionManagers } from 'views/PositionManagers'

const Page = () => <PositionManagers />

Page.chains = SUPPORTED_CHAIN_IDS

export default Page
