import { ChainId } from '@pancakeswap/chains'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import ABNBWarning from './ABNBWarning'
import BTTWarning from './BTTWarning'
import BondlyWarning from './BondlyWarning'
import CcarWarning from './CcarWarning'
import FREEWarning from './FREEWarning'
import GalaWarning from './GalaWarning'
import ItamWarning from './ItamWarning'
import LUSDWarning from './LUSDWarning'
import METISWarning from './METISWarning'
import NFPWarning from './NFPWarning'
import RugPullWarning from './RugPullWarning'
import SafemoonWarning from './SafemoonWarning'
import XCADWarning from './XCADWarning'

const { safemoon, bondly, itam, ccar, bttold, pokemoney, free, gala, abnbc, xcad, metis, lusd, nfp } =
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
  [lusd.address]: {
    symbol: lusd.symbol,
    component: <LUSDWarning />,
  },
  [nfp.address]: {
    symbol: nfp.symbol,
    component: <NFPWarning />,
  },
}

export default BSC_WARNING_LIST
