import { useActiveIfoConfig } from 'hooks/useIfoConfig'

import CurrentIfo from './CurrentIfo'
import { IfoPlaceholder } from './IfoPlaceholder'
import SoonIfo from './SoonIfo'

const Ifo = () => {
  const { activeIfo, isLoading } = useActiveIfoConfig()
  return activeIfo ? <CurrentIfo activeIfo={activeIfo} /> : isLoading ? <IfoPlaceholder /> : <SoonIfo />
}

export default Ifo
