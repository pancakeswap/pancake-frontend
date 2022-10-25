import { ifos } from 'config/constants/ifo'
import CurrentIfo from './CurrentIfo'
import SoonIfo from './SoonIfo'

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifos.find((ifo) => ifo.isActive)

const Ifo = () => {
  return activeIfo ? <CurrentIfo activeIfo={activeIfo} /> : <SoonIfo />
}

export default Ifo
