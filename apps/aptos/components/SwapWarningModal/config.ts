import { APTSWarning } from './APTSWarning'
import MojoWarning from './MojoWarning'

const TOKEN_WARNINGS = {
  '0x881ac202b1f1e6ad4efcff7a1d0579411533f2502417a19211cfc49751ddb5f4::coin::MOJO': {
    symbol: 'MOJO',
    component: MojoWarning,
  },
  '0xc71d94c49826b7d81d740d5bfb80b001a356198ed7b8005ae24ccedff82b299c::bridge::APTS': {
    symbol: 'APTS',
    component: APTSWarning,
  },
}

export default TOKEN_WARNINGS
