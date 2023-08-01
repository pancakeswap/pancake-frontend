import { ChainId } from '@pancakeswap/sdk'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import SafemoonWarning from './SafemoonWarning'
import ItamWarning from './ItamWarning'
import BondlyWarning from './BondlyWarning'
import CcarWarning from './CcarWarning'
import BTTWarning from './BTTWarning'
import RugPullWarning from './RugPullWarning'
import FREEWarning from './FREEWarning'
import GalaWarning from './GalaWarning'
import ABNBWarning from './ABNBWarning'
import XCADWarning from './XCADWarning'
import METISWarning from './METISWarning'

const { safemoon, bondly, itam, ccar, bttold, pokemoney, free, gala, abnbc, xcad, metis } =
  SwapWarningTokensConfig[ChainId.BSC]

const BSC_WARNING_LIST = {
  [safemoon.address]: {
    symbol: safemoon.symbol,
    component: <SafemoonWarning />,
  },
  [bondly.address]: {
    symbol: bondly.symbol,
    component: <BondlyWarning />,
  },
  [itam.address]: {
    symbol: itam.symbol,
    component: <ItamWarning />,
  },
  [ccar.address]: {
    symbol: ccar.symbol,
    component: <CcarWarning />,
  },
  [bttold.address]: {
    symbol: bttold.symbol,
    component: <BTTWarning />,
  },
  [pokemoney.address]: {
    symbol: pokemoney.symbol,
    component: <RugPullWarning />,
  },
  [free.address]: {
    symbol: free.symbol,
    component: <FREEWarning />,
  },
  [gala.address]: {
    symbol: gala.symbol,
    component: <GalaWarning />,
  },
  [abnbc.address]: {
    symbol: abnbc.symbol,
    component: <ABNBWarning />,
  },
  [xcad.address]: {
    symbol: xcad.symbol,
    component: <XCADWarning />,
  },
  [metis.address]: {
    symbol: metis.symbol,
    component: <METISWarning />,
  },
}

export default BSC_WARNING_LIST
