import { CHAIN_IDS } from 'utils/wagmi'
import Migration from '../views/Migration/v3'

const MigrationPage = () => <Migration />

MigrationPage.chains = CHAIN_IDS

export default MigrationPage
