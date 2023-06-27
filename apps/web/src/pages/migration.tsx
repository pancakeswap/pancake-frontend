import { V3_MIGRATION_SUPPORTED_CHAINS } from 'utils/isV3MigrationSupported'
import Migration from '../views/Migration/v3'

const MigrationPage = () => <Migration />

MigrationPage.chains = V3_MIGRATION_SUPPORTED_CHAINS

export default MigrationPage
