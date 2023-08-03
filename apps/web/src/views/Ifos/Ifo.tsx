import { useActiveIfoConfig } from 'hooks/useIfoConfig'

import CurrentIfo from './CurrentIfo'
import SoonIfo from './SoonIfo'

const Ifo = () => {
  const activeIfo = useActiveIfoConfig()
  return activeIfo ? <CurrentIfo activeIfo={activeIfo} /> : <SoonIfo />
}

export default Ifo
