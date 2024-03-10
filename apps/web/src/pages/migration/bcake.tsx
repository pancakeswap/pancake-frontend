import { V3_MIGRATION_SUPPORTED_CHAINS } from 'config/constants/supportChains'
import Migration from 'views/Migration/bCake'

const MigrationPage = () => <Migration />

MigrationPage.chains = V3_MIGRATION_SUPPORTED_CHAINS

export default MigrationPage
