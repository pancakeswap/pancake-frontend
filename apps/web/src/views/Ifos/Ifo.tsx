import { useActiveIfoConfig } from 'hooks/useIfoConfig'

import CurrentIfo from './CurrentIfo'
import { IfoPlaceholder } from './IfoPlaceholder'

const Ifo = () => {
  const activeIfo = useActiveIfoConfig()
  return activeIfo ? <CurrentIfo activeIfo={activeIfo} /> : <IfoPlaceholder />
}

export default Ifo
