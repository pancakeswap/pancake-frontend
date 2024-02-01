import { useActiveIfoConfig } from 'hooks/useIfoConfig'

import CurrentIfo from './CurrentIfo'
import { IfoPlaceholder } from './IfoPlaceholder'
import SoonIfo from './SoonIfo'

const Ifo = () => {
  const { activeIfo, isPending } = useActiveIfoConfig()
  return activeIfo ? <CurrentIfo activeIfo={activeIfo} /> : isPending ? <IfoPlaceholder /> : <SoonIfo />
}

export default Ifo
