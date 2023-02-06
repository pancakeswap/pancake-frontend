import { MpPageLayout } from 'components/MpPageLayout'
import Farms from './Farms'

const FarmsMpPageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <MpPageLayout>
      <Farms>{children}</Farms>
    </MpPageLayout>
  )
}
export default FarmsMpPageLayout
