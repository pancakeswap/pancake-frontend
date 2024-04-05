import { ChainId } from '@pancakeswap/sdk'
import Migration from 'views/Migration/bCake'

const V2_SS_PM_SUPPORTED_CHAINS = [ChainId.BSC]
const MigrationPage = () => <Migration />

MigrationPage.chains = V2_SS_PM_SUPPORTED_CHAINS

export default MigrationPage
