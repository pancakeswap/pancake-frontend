import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 139,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xFB7E9FE9D13561AdA7131Fa746942a14F7dd4Cf6',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 250,
    lpSymbol: 'τBTC-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0xFD09CDbd6A7dCAd8AC47df4F139443a729264763',
    },
    token: tokens.τbtc,
    quoteToken: tokens.btcb,
  },
  {
    pid: 193,
    lpSymbol: 'SWINGBY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xA0e3F72BAFcc5d52F0052a39165FD40D3d4d34Fc',
    },
    token: tokens.swingby,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 249,
    lpSymbol: 'XED-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xBbE20dA99db94Fa1077F1C9A5d256761dAf89C60',
    },
    token: tokens.xed,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 248,
    lpSymbol: 'HAKKA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x9ed1ca73AA8F1ccdc3c3a174E77014f8900411CE',
    },
    token: tokens.hakka,
    quoteToken: tokens.busd,
  },
  {
    pid: 247,
    lpSymbol: 'CGG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xB9aA8B0d67DE546aaa82091065a64B7F1C4B1a1F',
    },
    token: tokens.cgg,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 246,
    lpSymbol: 'SUTER-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6f41c9226fa89a552009c3AC087BA74b83772C52',
    },
    token: tokens.suter,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 245,
    lpSymbol: 'bROOBEE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5Ac5184eA06dE24ce8ED2133f58b4Aa2CEd2dC3b',
    },
    token: tokens.broobee,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 244,
    lpSymbol: 'HZN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xF7fcD7e7B3853bf59bCA9183476F218ED07eD3B0',
    },
    token: tokens.hzn,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 243,
    lpSymbol: 'ALPA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xBB41898A3051A6b6D4A36a1c43e906b05799B744',
    },
    token: tokens.alpa,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 242,
    lpSymbol: 'PERL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xB1C2e08A992a619DA570425E78828A8508654f4F',
    },
    token: tokens.perl,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 241,
    lpSymbol: 'TLM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x25f15Cb3D3B3753702E1d5c4E5f6F0720b197843',
    },
    token: tokens.tlm,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 240,
    lpSymbol: 'JGN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8fD5ca41B2B44e4713590584f97c85f9FF59F00D',
    },
    token: tokens.jgn,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 239,
    lpSymbol: 'EPS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x43bc6C256240e657Ad84aFb86825E21B48FEDe78',
    },
    token: tokens.eps,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 238,
    lpSymbol: 'ARPA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD55e5A7b886aE9657b95641c6A7dc5A662EcAbF3',
    },
    token: tokens.arpa,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 237,
    lpSymbol: 'ITAM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3e78b0eD211a49e263fF9b3F0B410932a021E368',
    },
    token: tokens.itam,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 236,
    lpSymbol: 'BONDLY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2205a6424ec4D74a7588450fB71ffd0C4A3Ead65',
    },
    token: tokens.bondly,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 235,
    lpSymbol: 'TKO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc43EdF4a7e89160135C2553E9868446fef9C18DD',
    },
    token: tokens.tko,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 234,
    lpSymbol: 'APYS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7A5523f50a80790cAD011167E20bD21056A2f04A',
    },
    token: tokens.apys,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 233,
    lpSymbol: 'HOO-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xc12dAD966505443b5aad7b0C55716c13d285B520',
    },
    token: tokens.hoo,
    quoteToken: tokens.busd,
  },
  {
    pid: 232,
    lpSymbol: 'ODDZ-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3B0a7d1030bcDFf45ABB7B03C04110FcCc8095BC',
    },
    token: tokens.oddz,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 231,
    lpSymbol: 'EASY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4b0ec41404a7FF59BaE33C8Dc420804c58B7bF24',
    },
    token: tokens.easy,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 230,
    lpSymbol: 'NRV-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x25dea33a42c7775F6945fae22A8fFBfAC9fB22CD',
    },
    token: tokens.nrv,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 229,
    lpSymbol: 'DEGO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6108aBd546AF17D8f7aFAe59EBfb4A01132A11Bb',
    },
    token: tokens.dego,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 228,
    lpSymbol: 'GUM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xA99d1926a3c15DC4Fb83aB3Fafd63B6C3E87CF22',
    },
    token: tokens.gum,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 227,
    lpSymbol: 'pBTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xaccd6673FFc24cD56B080D71384327f78fD92496',
    },
    token: tokens.pbtc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 226,
    lpSymbol: 'DFT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe86d075051f20eb8c741007Cb8e262f4519944ee',
    },
    token: tokens.dft,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 225,
    lpSymbol: 'SWTH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4f6dfFc9795d35dc1D92c2a7B23Cb7d6EF190B33',
    },
    token: tokens.swth,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 224,
    lpSymbol: 'LIEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xbe7BDE4aD1c136038Dc9f57ef94d1d16e6F9CbF7',
    },
    token: tokens.lien,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 223,
    lpSymbol: 'ZIL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xcBDf499db66Df19A66aB48F16C790FF9eE872add',
    },
    token: tokens.zil,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 222,
    lpSymbol: 'pCWS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe3D941e74141311436F82523817EBaa26462967d',
    },
    token: tokens.pcws,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 221,
    lpSymbol: 'bBADGER-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0x87Ae7b5c43D4e160cDB9427a78BA87B9503ee37b',
    },
    token: tokens.bbadger,
    quoteToken: tokens.btcb,
  },
  {
    pid: 220,
    lpSymbol: 'bDIGG-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0xfbfa92e037e37F946c0105902640914E3aCe6752',
    },
    token: tokens.bdigg,
    quoteToken: tokens.btcb,
  },
  {
    pid: 219,
    lpSymbol: 'LTO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xF62e92292772F24EAa6B6B8a105c9FC7B8F31EC5',
    },
    token: tokens.lto,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 218,
    lpSymbol: 'MIR-UST LP',
    lpAddresses: {
      97: '',
      56: '0x905186a70ba3Eb50090d1d0f6914F5460B4DdB40',
    },
    token: tokens.mir,
    quoteToken: tokens.ust,
  },
  {
    pid: 217,
    lpSymbol: 'TRADE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x52fCfB6d91Bcf1F1f6d375D0f6c303688b0E8550',
    },
    token: tokens.trade,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 216,
    lpSymbol: 'DUSK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x69773f622cE228Ca7dEd42D8C34Eba8582e85dcA',
    },
    token: tokens.dusk,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 215,
    lpSymbol: 'BIFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x01956F08A55e4FF9775bc01aF6ACb09144564837',
    },
    token: tokens.bifi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 214,
    lpSymbol: 'TXL-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8Ba7eB4056338fd7271E1b7431C8ca3827eF907c',
    },
    token: tokens.txl,
    quoteToken: tokens.busd,
  },
  {
    pid: 213,
    lpSymbol: 'COS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xAfB2e729A24629aBdE8E55CEB0e1f899bEe0f70f',
    },
    token: tokens.cos,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 212,
    lpSymbol: 'BUNNY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x283FA8d459Da6e3165B2faF7FA0DD0137503DECf',
    },
    token: tokens.bunny,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 211,
    lpSymbol: 'ALICE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9e1BB5033d47BF8F16FC017CEC0959De7FF00833',
    },
    token: tokens.alice,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 210,
    lpSymbol: 'FOR-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xaBB817B07663521Cf64B006EC9D0FF185b65cfE5',
    },
    token: tokens.for,
    quoteToken: tokens.busd,
  },
  {
    pid: 209,
    lpSymbol: 'BUX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7aA4eb5c3bF33e3AD41A47e26b3Bd9b902984610',
    },
    token: tokens.bux,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 208,
    lpSymbol: 'NULS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xaB46737CAAFbB99999f8b91E4D3C6D4D28E10e05',
    },
    token: tokens.nuls,
    quoteToken: tokens.busd,
  },
  {
    pid: 207,
    lpSymbol: 'BELT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x446ff2C0F5350bF2dadD0e0F1AaAA573b362CA6B',
    },
    token: tokens.belt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 206,
    lpSymbol: 'RAMP-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6ED589e69D1927AC45054cBb6E57877879384d6F',
    },
    token: tokens.ramp,
    quoteToken: tokens.busd,
  },
  {
    pid: 205,
    lpSymbol: 'BFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xFFA2357f1E6f48d74b1c18c363c3Fe58A032405a',
    },
    token: tokens.bfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 204,
    lpSymbol: 'DEXE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x534b0b0700c0cfF9785852707f07f60E7C0bc07E',
    },
    token: tokens.dexe,
    quoteToken: tokens.busd,
  },
  {
    pid: 203,
    lpSymbol: 'BEL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2013265224E3cB6A53C67130F9Fe53Ae36CFcfdd',
    },
    token: tokens.bel,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 202,
    lpSymbol: 'TPT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xC14c2dd21d6aEA3C2068A1F8e58d41D3c28F9288',
    },
    token: tokens.tpt,
    quoteToken: tokens.busd,
  },
  {
    pid: 201,
    lpSymbol: 'WATCH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD5fBfFf5faB9d29f614d9bd50AF9b1356C53049C',
    },
    token: tokens.watch,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 200,
    lpSymbol: 'xMARK-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x601aE41C5a65b2089a6af2CcfaF984896a1f52AD',
    },
    token: tokens.xmark,
    quoteToken: tokens.busd,
  },
  {
    pid: 199,
    lpSymbol: 'bMXX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x037d38c7DfF5732DAA5f8C05478Eb75cdf24f42B',
    },
    token: tokens.bmxx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 198,
    lpSymbol: 'IOTX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8503462D0d4D3ce73e857bCC7D0Ef1125B0d66fF',
    },
    token: tokens.iotx,
    quoteToken: tokens.busd,
  },
  {
    pid: 197,
    lpSymbol: 'BOR-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xE0243Ce3b50bd551168cE6964F178507d0a1acD5',
    },
    token: tokens.bor,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 196,
    lpSymbol: 'bOPEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD2FcF98EaeD2c08e9BcA854802C07b93D27913aC',
    },
    token: tokens.bopen,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 195,
    lpSymbol: 'SUSHI-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x3BECbb09F622187B544C0892EeDeB58C004117e1',
    },
    token: tokens.sushi,
    quoteToken: tokens.eth,
  },
  {
    pid: 194,
    lpSymbol: 'DODO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x220e34306a93002fB7947C9Fc633d6f538bd5032',
    },
    token: tokens.dodo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 192,
    lpSymbol: 'BRY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xC3E303647cbD43EC22989275e7ecFA8952A6BA02',
    },
    token: tokens.bry,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 191,
    lpSymbol: 'ZEE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6d1299B158bd13F4B50e951aaBf2Aa501FD87E52',
    },
    token: tokens.zee,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 190,
    lpSymbol: 'SWGb-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd2A5008d555371e97F30B6dD71597b4F1eDB0f20',
    },
    token: tokens.swgb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 189,
    lpSymbol: 'COMP-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x6A55a9176f11c1118f01CBaf6c4033a5c1B22a81',
    },
    token: tokens.comp,
    quoteToken: tokens.eth,
  },
  {
    pid: 188,
    lpSymbol: 'SFP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x01744B868fe98dB669EBf4e9CA557462BAA6097c',
    },
    token: tokens.sfp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 187,
    lpSymbol: 'LINA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xb923A2Beeb0834528D20b8973A2c69088571aA9E',
    },
    token: tokens.lina,
    quoteToken: tokens.busd,
  },
  {
    pid: 186,
    lpSymbol: 'LIT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x41D69Beda3AFF2FFE48E715e2f4248Cb272cFf30',
    },
    token: tokens.lit,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 185,
    lpSymbol: 'HGET-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x239aD1874114B2235485e34b14c48dB73CCA3ffb',
    },
    token: tokens.hget,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 184,
    lpSymbol: 'BDO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xF7045D7dE334a3F6c1254f98167b2af130eEA8E6',
    },
    token: tokens.bdo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 183,
    lpSymbol: 'EGLD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xB4670bBEce2D02c4D30786D173985A984686042C',
    },
    token: tokens.egld,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 182,
    lpSymbol: 'UST-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x1719606031F1E0B3CCaCa11A2CF550Ef8feBEB0F',
    },
    token: tokens.ust,
    quoteToken: tokens.busd,
  },
  {
    pid: 181,
    lpSymbol: 'mAMZN-UST LP',
    lpAddresses: {
      97: '',
      56: '0x2c065E42B464ef38480778B0624A207A09042481',
    },
    token: tokens.mamzn,
    quoteToken: tokens.ust,
  },
  {
    pid: 180,
    lpSymbol: 'mGOOGL-UST LP',
    lpAddresses: {
      97: '',
      56: '0x74d8Dbac5053d31E904a821A3B4C411Bd4dd2307',
    },
    token: tokens.mgoogl,
    quoteToken: tokens.ust,
  },
  {
    pid: 179,
    lpSymbol: 'mNFLX-UST LP',
    lpAddresses: {
      97: '',
      56: '0xe1d76359FE4Eb7f0dAd1D719256c22890864718E',
    },
    token: tokens.mnflx,
    quoteToken: tokens.ust,
  },
  {
    pid: 178,
    lpSymbol: 'mTSLA-UST LP',
    lpAddresses: {
      97: '',
      56: '0x36285DDD149949f366b5aFb3f41Cea71d35B8c9e',
    },
    token: tokens.mtsla,
    quoteToken: tokens.ust,
  },
  {
    pid: 177,
    lpSymbol: 'wSOTE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe5909de3822d589c220Fb4FA1660A0Fd251Fa87d',
    },
    token: tokens.wsote,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 176,
    lpSymbol: 'FRONT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x84Df48B3e900C79539F6c523D6F528802BeAa713',
    },
    token: tokens.front,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 175,
    lpSymbol: 'Helmet-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD09648792d7e77523ae311Fa5A8F38E4684A5f15',
    },
    token: tokens.helmet,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 174,
    lpSymbol: 'BTCST-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xf967845A6D30C44b555C49C50530076dF5D7fd75',
    },
    token: tokens.btcst,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 173,
    lpSymbol: 'LTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x286E8d71722c585c9A82876B1B2FB4dEe9fc536E',
    },
    token: tokens.ltc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 172,
    lpSymbol: 'USDC-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x05FC2ac8a4FA697501087C916c87b8a5dc4f7b46',
    },
    token: tokens.usdc,
    quoteToken: tokens.busd,
  },
  {
    pid: 171,
    lpSymbol: 'DAI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xdaFE10aA3AB6758596aDAC70f6873C49F5a9bf86',
    },
    token: tokens.dai,
    quoteToken: tokens.busd,
  },
  {
    pid: 170,
    lpSymbol: 'BSCX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5fE5394BBc394345737b8e6e48be2804E89eC0eB',
    },
    token: tokens.bscx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 169,
    lpSymbol: 'TEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x003C4d60de42eAD30739dD204BD153fE69E20Fb2',
    },
    token: tokens.ten,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 168,
    lpSymbol: 'bALBT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1B8ab50d894CfE793B44057F681A950E87Bd0331',
    },
    token: tokens.balbt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 167,
    lpSymbol: 'REEF-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x074ed2De503580887073A0F788E035C0fbe13F48',
    },
    token: tokens.reef,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 166,
    lpSymbol: 'Ditto-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xb33D432eACe45DF62F0145228B550b214DCaA6D4',
    },
    token: tokens.ditto,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 165,
    lpSymbol: 'VAI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x9d95063661fa34B67E0Be0cc71Cf92fc6126aF37',
    },
    token: tokens.vai,
    quoteToken: tokens.busd,
  },
  {
    pid: 164,
    lpSymbol: 'BLK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xdA5a79fFe24739876a52AEF0d419aBB3b2517922',
    },
    token: tokens.blink,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 163,
    lpSymbol: 'UNFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x029f944CD3afa7c229122b19c706d8B7c01e062a',
    },
    token: tokens.unfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 162,
    lpSymbol: 'HARD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x158e337e7Dcfcd8FC512840208BB522d122bB19d',
    },
    token: tokens.hard,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 161,
    lpSymbol: 'CTK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xcbb3fCE7134aF9ef2f3DCe0EAE96db68961b1337',
    },
    token: tokens.ctk,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 160,
    lpSymbol: 'SXP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6294D8518b7321dc22E32AA907A89B1DAfc1aDbB',
    },
    token: tokens.sxp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 159,
    lpSymbol: 'INJ-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0444712EE8DFF8913B2b44CB1D2a0273b4CDaBe9',
    },
    token: tokens.inj,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 158,
    lpSymbol: 'FIL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD027c0B352578b1Cf57f472107591CaE5fa27Eb1',
    },
    token: tokens.fil,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 157,
    lpSymbol: 'UNI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2937202a53C82E36bC8beCFBe79795bedF284804',
    },
    token: tokens.uni,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 156,
    lpSymbol: 'YFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xfffad7374c894E65b498BDBD489a9a5324A59F60',
    },
    token: tokens.yfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 155,
    lpSymbol: 'YFII-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x237E7016Ff50D3B704A7e07571aE08628909A116',
    },
    token: tokens.yfii,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 154,
    lpSymbol: 'ATOM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7DD05eF533b1eBCE7815c90678D4B7344E32b8c9',
    },
    token: tokens.atom,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 153,
    lpSymbol: 'XRP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0F640E3ec77415Fd810D18B3ac000cD8a172E22f',
    },
    token: tokens.xrp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 152,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4160910ca32eAD83B6d4b32107974397D2579c2d',
    },
    token: tokens.usdt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 151,
    lpSymbol: 'ALPHA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0edAA38Bd263E83fAECbC8476822800F30eE6028',
    },
    token: tokens.alpha,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 150,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x356b7d0d3c54F22C82B7a670C6Ba9E2381b0624c',
    },
    token: tokens.btcb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 149,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4D7078a6B348766E7a16cD6e6fCb3064721bc6a6',
    },
    token: tokens.eth,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 148,
    lpSymbol: 'XVS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x77B5dB64fD4Cf5B699855420fF2608B2EA6708B3',
    },
    token: tokens.xvs,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 147,
    lpSymbol: 'TWT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x34910518Faf5bfd3a4D15ccFE104B63f06ee3d85',
    },
    token: tokens.twt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 146,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x28b81C6b155fd9152AE4A09c4eeB7E7F1C114FaC',
    },
    token: tokens.usdt,
    quoteToken: tokens.busd,
  },
  {
    pid: 145,
    lpSymbol: 'LINK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x380941fFd7b7cbf4AEbBfa8A26aa80c2f6570909',
    },
    token: tokens.link,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 144,
    lpSymbol: 'EOS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x082A80b3a55BD3B320a16678784186a979882b21',
    },
    token: tokens.eos,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 143,
    lpSymbol: 'DOT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3aFfc4dd05286ed6B7206Fc85219d222130e35a9',
    },
    token: tokens.dot,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 142,
    lpSymbol: 'BAND-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x473390697036E7611a670575eA9141583471fF47',
    },
    token: tokens.band,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 141,
    lpSymbol: 'ADA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xec0C5719cC100DfB6c6F371bb48d3D079ab6A6D2',
    },
    token: tokens.ada,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 140,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9bdEdb0c876fC0Da79D945DF28942b898Af89Fc7',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
  /**
   * All farms below here are from v1 and are to be set to 0x
   */
  {
    pid: 1,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 136,
    lpSymbol: 'τBTC-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0x2d4e52c48fd18ee06d3959e82ab0f773c41b9277',
    },
    token: tokens.τbtc,
    quoteToken: tokens.btcb,
  },
  {
    pid: 76,
    lpSymbol: 'SWINGBY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4576C456AF93a37a096235e5d83f812AC9aeD027',
    },
    token: tokens.swingby,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 135,
    lpSymbol: 'XED-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x718d3baa161e1a38758bb0f1fe751e401f431ac4',
    },
    token: tokens.xed,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 134,
    lpSymbol: 'HAKKA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x56bc8de6e90a8454cb2614b33e750d960aecdf12',
    },
    token: tokens.hakka,
    quoteToken: tokens.busd,
  },
  {
    pid: 133,
    lpSymbol: 'CGG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x484c60f6202c8043DCA0236bB3101ada7ec50AD4',
    },
    token: tokens.cgg,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 132,
    lpSymbol: 'SUTER-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6Ff75C20656A0E4745E7c114972D361F483AFa5f',
    },
    token: tokens.suter,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 131,
    lpSymbol: 'bROOBEE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9e6f9f3382f9edc683203b528222c554c92382c2',
    },
    token: tokens.broobee,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 130,
    lpSymbol: 'HZN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xee4ca18e91012bf87fefde3dd6723a8834347a4d',
    },
    token: tokens.hzn,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 129,
    lpSymbol: 'ALPA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x837cd42282801e340f1f17aadf3166fee99fb07c',
    },
    token: tokens.alpa,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 128,
    lpSymbol: 'PERL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x044e9985c14a547d478b1e3d4a4e562e69c8f936',
    },
    token: tokens.perl,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 127,
    lpSymbol: 'TLM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x34e821e785A93261B697eBD2797988B3AA78ca33',
    },
    token: tokens.tlm,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 125,
    lpSymbol: 'JGN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x890479844484D67e34B99e1BBc1468231b254c08',
    },
    token: tokens.jgn,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 124,
    lpSymbol: 'EPS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xf9045866e7b372def1eff3712ce55fac1a98daf0',
    },
    token: tokens.eps,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 123,
    lpSymbol: 'ARPA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xfb29fca952b478ddcb8a43f57176161e498225b1',
    },
    token: tokens.arpa,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 122,
    lpSymbol: 'ITAM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xCdC53345192D0e31eEAD03D7E9e008Ee659FAEbE',
    },
    token: tokens.itam,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 121,
    lpSymbol: 'BONDLY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x67581bfb4fc13bb73c71489b504e9b5354769063',
    },
    token: tokens.bondly,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 120,
    lpSymbol: 'TKO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x496a8b716A3A3410B16e71E3c906968CE4488e52',
    },
    token: tokens.tko,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 119,
    lpSymbol: 'APYS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xE5783Cc9dFb3E7e474B81B07369a008e80F1cEdb',
    },
    token: tokens.apys,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 118,
    lpSymbol: 'HOO-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3c9e55edbd937ae0ad8c084a1a8302110612a371',
    },
    token: tokens.hoo,
    quoteToken: tokens.busd,
  },
  {
    pid: 117,
    lpSymbol: 'ODDZ-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61376b56ff33c618b115131712a4138f98810a6a',
    },
    token: tokens.oddz,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 116,
    lpSymbol: 'EASY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xbd1ec00b0d1cca9d5b28fbe0bb7d664238af2ffa',
    },
    token: tokens.easy,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 115,
    lpSymbol: 'NRV-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5a805994a2e30ac710e7376ccc0211285bd4dd92',
    },
    token: tokens.nrv,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 114,
    lpSymbol: 'DEGO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x17F0b998B81cE75074a7CDAdAe6D63Da3cb23572',
    },
    token: tokens.dego,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 113,
    lpSymbol: 'GUM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x155645cDF8e4B28d5B7790b65d9f79efc222740C',
    },
    token: tokens.gum,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 112,
    lpSymbol: 'pBTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xb5f6f7dad23132d40d778085d795bd0fd4b859cd',
    },
    token: tokens.pbtc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 111,
    lpSymbol: 'DFT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8FbCbD7e30b1733965a8980bf7Ae2ca1c0C456cc',
    },
    token: tokens.dft,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 110,
    lpSymbol: 'SWTH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8c5cFfad6cddb96Ee33DA685D0d50a37e030E115',
    },
    token: tokens.swth,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 109,
    lpSymbol: 'LIEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xcd14855150335AAE984aa6D281E090c27035C692',
    },
    token: tokens.lien,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 108,
    lpSymbol: 'ZIL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc746337b5f800a0e19ed4eb3bda03ff1401b8167',
    },
    token: tokens.zil,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 107,
    lpSymbol: 'pCWS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x889e81d25bffba437b2a5d3e0e4fc58a0e2749c5',
    },
    token: tokens.pcws,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 106,
    lpSymbol: 'bBADGER-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0x10F461CEAC7A17F59e249954Db0784d42EfF5DB5',
    },
    token: tokens.bbadger,
    quoteToken: tokens.btcb,
  },
  {
    pid: 104,
    lpSymbol: 'bDIGG-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0xE1E33459505bB3763843a426F7Fd9933418184ae',
    },
    token: tokens.bdigg,
    quoteToken: tokens.btcb,
  },
  {
    pid: 103,
    lpSymbol: 'LTO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x85644fcd00c401e1a0a0a10d2ae6bbe04a73e4ab',
    },
    token: tokens.lto,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 102,
    lpSymbol: 'MIR-UST LP',
    lpAddresses: {
      97: '',
      56: '0xf64a269F0A06dA07D23F43c1Deb217101ee6Bee7',
    },
    token: tokens.mir,
    quoteToken: tokens.ust,
  },
  {
    pid: 101,
    lpSymbol: 'TRADE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2562f94E90dE6D9eb4fB6B3b8Eab56b15Aa4FC72',
    },
    token: tokens.trade,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 100,
    lpSymbol: 'DUSK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xB7918560273FD56e50E9c215CC0DFE8D764C36C5',
    },
    token: tokens.dusk,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 99,
    lpSymbol: 'BIFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd132D2C24F29EE8ABb64a66559d1b7aa627Bd7fD',
    },
    token: tokens.bifi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 98,
    lpSymbol: 'TXL-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xD20E0BcCa8B29409bf5726CB24DD779Fe337020e',
    },
    token: tokens.txl,
    quoteToken: tokens.busd,
  },
  {
    pid: 97,
    lpSymbol: 'COS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7b1e440240B220244761C9D9A3B07fbA1995BD84',
    },
    token: tokens.cos,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 96,
    lpSymbol: 'BUNNY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7Bb89460599Dbf32ee3Aa50798BBcEae2A5F7f6a',
    },
    token: tokens.bunny,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 95,
    lpSymbol: 'ALICE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe022baa3E5E87658f789c9132B10d7425Fd3a389',
    },
    token: tokens.alice,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 94,
    lpSymbol: 'FOR-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xfEc200A5E3adDD4a7915a556DDe3F5850e644020',
    },
    token: tokens.for,
    quoteToken: tokens.busd,
  },
  {
    pid: 93,
    lpSymbol: 'BUX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0F556f4E47513d1a19Be456a9aF778d7e1A226B9',
    },
    token: tokens.bux,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 92,
    lpSymbol: 'NULS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xCA01F5D89d5b1d24ca5D6Ecc856D21e8a61DAFCc',
    },
    token: tokens.nuls,
    quoteToken: tokens.busd,
  },
  {
    pid: 91,
    lpSymbol: 'NULS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xad7e515409e5a7d516411a85acc88c5e993f570a',
    },
    token: tokens.nuls,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 90,
    lpSymbol: 'BELT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x83B92D283cd279fF2e057BD86a95BdEfffED6faa',
    },
    token: tokens.belt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 89,
    lpSymbol: 'RAMP-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xbF36959939982D0D34B37Fb3f3425da9676C13a3',
    },
    token: tokens.ramp,
    quoteToken: tokens.busd,
  },
  {
    pid: 88,
    lpSymbol: 'BFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x45a9e8d48bc560416008d122c9437927fed50e7d',
    },
    token: tokens.bfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 87,
    lpSymbol: 'DEXE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x69ab367bc1bea1d2c0fb4dbaec6b7197951da56c',
    },
    token: tokens.dexe,
    quoteToken: tokens.busd,
  },
  {
    pid: 86,
    lpSymbol: 'BEL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xAB97952a2806D5c92b7046c7aB13a72A87e0097b',
    },
    token: tokens.bel,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 85,
    lpSymbol: 'TPT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x4db28767d1527ba545ca5bbda1c96a94ed6ff242',
    },
    token: tokens.tpt,
    quoteToken: tokens.busd,
  },
  {
    pid: 84,
    lpSymbol: 'WATCH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xdc6c130299e53acd2cc2d291fa10552ca2198a6b',
    },
    token: tokens.watch,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 83,
    lpSymbol: 'xMARK-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x292ca56ed5b3330a19037f835af4a9c0098ea6fa',
    },
    token: tokens.xmark,
    quoteToken: tokens.busd,
  },
  {
    pid: 82,
    lpSymbol: 'bMXX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4D5aA94Ce6BbB1BC4eb73207a5a5d4D052cFcD67',
    },
    token: tokens.bmxx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 81,
    lpSymbol: 'IOTX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x36b8b28d37f93372188f2aa2507b68a5cd8b2664',
    },
    token: tokens.iotx,
    quoteToken: tokens.busd,
  },
  {
    pid: 80,
    lpSymbol: 'BOR-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x86e650350c40a5178a5d014ba37fe8556232b898',
    },
    token: tokens.bor,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 79,
    lpSymbol: 'bOPEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9d8b7e4a9d53654d82f12c83448d8f92732bc761',
    },
    token: tokens.bopen,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 78,
    lpSymbol: 'SUSHI-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x17580340f3daedae871a8c21d15911742ec79e0f',
    },
    token: tokens.sushi,
    quoteToken: tokens.eth,
  },
  {
    pid: 77,
    lpSymbol: 'DODO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9e642d174b14faea31d842dc83037c42b53236e6',
    },
    token: tokens.dodo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 75,
    lpSymbol: 'BRY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5E3CD27F36932Bc0314aC4e2510585798C34a2fC',
    },
    token: tokens.bry,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 74,
    lpSymbol: 'ZEE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xb5ab3996808c7e489dcdc0f1af2ab212ae0059af',
    },
    token: tokens.zee,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 73,
    lpSymbol: 'SWGb-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc1800c29cf91954357cd0bf3f0accaada3d0109c',
    },
    token: tokens.swgb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 72,
    lpSymbol: 'COMP-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x0392957571f28037607c14832d16f8b653edd472',
    },
    token: tokens.comp,
    quoteToken: tokens.eth,
  },
  {
    pid: 71,
    lpSymbol: 'SFP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xcbe2cf3bd012e9c1ade2ee4d41db3dac763e78f3',
    },
    token: tokens.sfp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 70,
    lpSymbol: 'BETH-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x99d865ed50d2c32c1493896810fa386c1ce81d91',
    },
    token: tokens.beth,
    quoteToken: tokens.eth,
  },
  {
    pid: 69,
    lpSymbol: 'LINA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xeb325a8ea1c5abf40c7ceaf645596c1f943d0948',
    },
    token: tokens.lina,
    quoteToken: tokens.busd,
  },
  {
    pid: 68,
    lpSymbol: 'LIT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x60bB03D1010b99CEAdD0dd209b64bC8bd83da161',
    },
    token: tokens.lit,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 67,
    lpSymbol: 'HGET-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x66b9e1eac8a81f3752f7f3a5e95de460688a17ee',
    },
    token: tokens.hget,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 66,
    lpSymbol: 'BDO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x74690f829fec83ea424ee1f1654041b2491a7be9',
    },
    token: tokens.bdo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 65,
    lpSymbol: 'EGLD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3ef4952c7a9afbe374ea02d1bf5ed5a0015b7716',
    },
    token: tokens.egld,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 63,
    lpSymbol: 'UST-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xD1F12370b2ba1C79838337648F820a87eDF5e1e6',
    },
    token: tokens.ust,
    quoteToken: tokens.busd,
  },
  {
    pid: 62,
    lpSymbol: 'mAMZN-UST LP',
    lpAddresses: {
      97: '',
      56: '0xc92Dc34665c8a21f98E1E38474580b61b4f3e1b9',
    },
    token: tokens.mamzn,
    quoteToken: tokens.ust,
  },
  {
    pid: 61,
    lpSymbol: 'mGOOGL-UST LP',
    lpAddresses: {
      97: '',
      56: '0x852A68181f789AE6d1Da3dF101740a59A071004f',
    },
    token: tokens.mgoogl,
    quoteToken: tokens.ust,
  },
  {
    pid: 60,
    lpSymbol: 'mNFLX-UST LP',
    lpAddresses: {
      97: '',
      56: '0xF609ade3846981825776068a8eD7746470029D1f',
    },
    token: tokens.mnflx,
    quoteToken: tokens.ust,
  },
  {
    pid: 59,
    lpSymbol: 'mTSLA-UST LP',
    lpAddresses: {
      97: '',
      56: '0xD5664D2d15cdffD597515f1c0D945c6c1D3Bf85B',
    },
    token: tokens.mtsla,
    quoteToken: tokens.ust,
  },
  {
    pid: 58,
    lpSymbol: 'wSOTE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xffb9e2d5ce4378f1a89b29bf53f80804cc078102',
    },
    token: tokens.wsote,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 57,
    lpSymbol: 'FRONT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x36b7d2e5c7877392fb17f9219efad56f3d794700',
    },
    token: tokens.front,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 56,
    lpSymbol: 'Helmet-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6411310c07d8c48730172146fd6f31fa84034a8b',
    },
    token: tokens.helmet,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 55,
    lpSymbol: 'BTCST-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x91589786D36fEe5B27A5539CfE638a5fc9834665',
    },
    token: tokens.btcst,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 54,
    lpSymbol: 'LTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xbc765fd113c5bdb2ebc25f711191b56bb8690aec',
    },
    token: tokens.ltc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 53,
    lpSymbol: 'USDC-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x680dd100e4b394bda26a59dd5c119a391e747d18',
    },
    token: tokens.usdc,
    quoteToken: tokens.busd,
  },
  {
    pid: 52,
    lpSymbol: 'DAI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3aB77e40340AB084c3e23Be8e5A6f7afed9D41DC',
    },
    token: tokens.dai,
    quoteToken: tokens.busd,
  },
  {
    pid: 51,
    lpSymbol: 'BSCX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x20781bc3701c5309ac75291f5d09bdc23d7b7fa8',
    },
    token: tokens.bscx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 50,
    lpSymbol: 'TEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x01ecc44ddd2d104f44d2aa1a2bd9dfbc91ae8275',
    },
    token: tokens.ten,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 49,
    lpSymbol: 'bALBT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xbe14f3a89a4f7f279af9d99554cf12e8c29db921',
    },
    token: tokens.balbt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 46,
    lpSymbol: 'OG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x64373608f2e93ea97ad4d8ca2cce6b2575db2f55',
    },
    token: tokens.og,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 47,
    lpSymbol: 'ASR-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd6b900d5308356317299dafe303e661271aa12f1',
    },
    token: tokens.asr,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 48,
    lpSymbol: 'ATM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd5b3ebf1a85d32c73a82b40f75e1cd929caf4029',
    },
    token: tokens.atm,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 45,
    lpSymbol: 'REEF-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x58B58cab6C5cF158f63A2390b817710826d116D0',
    },
    token: tokens.reef,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 44,
    lpSymbol: 'Ditto-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x470bc451810b312bbb1256f96b0895d95ea659b1',
    },
    token: tokens.ditto,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 43,
    lpSymbol: 'JUV-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x51a2ffa5b7de506f9a22549e48b33f6cf0d9030e',
    },
    token: tokens.juv,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 42,
    lpSymbol: 'PSG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9c4f6a5050cf863e67a402e8b377973b4e3372c1',
    },
    token: tokens.psg,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 39,
    lpSymbol: 'UNFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xbEA35584b9a88107102ABEf0BDeE2c4FaE5D8c31',
    },
    token: tokens.unfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 41,
    lpSymbol: 'VAI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xff17ff314925dff772b71abdff2782bc913b3575',
    },
    token: tokens.vai,
    quoteToken: tokens.busd,
  },
  {
    pid: 40,
    lpSymbol: 'BLK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xC743Dc05F03D25E1aF8eC5F8228f4BD25513c8d0',
    },
    token: tokens.blink,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 37,
    lpSymbol: 'HARD-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x9f40e8a2fcaa267a0c374b6c661e0b372264cc3d',
    },
    token: tokens.hard,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '0x2f7682b64b88149ba3250aee32db712964de5fa9',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'ADA-BNB LP',
    lpAddresses: {
      97: '0xcbe3282a562e23b8c61ed04bb72ffdbb9233b1ce',
      56: '0xba51d1ab95756ca4eab8737ecd450cd8f05384cf',
    },
    token: tokens.ada,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'BAND-BNB LP',
    lpAddresses: {
      97: '0xcbe3282a562e23b8c61ed04bb72ffdbb9233b1ce',
      56: '0xc639187ef82271d8f517de6feae4faf5b517533c',
    },
    token: tokens.band,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 5,
    lpSymbol: 'DOT-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xbcd62661a6b1ded703585d3af7d7649ef4dcdb5c',
    },
    token: tokens.dot,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 6,
    lpSymbol: 'EOS-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x981d2ba1b298888408d342c39c2ab92e8991691e',
    },
    token: tokens.eos,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 7,
    lpSymbol: 'LINK-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xaebe45e3a03b734c68e5557ae04bfc76917b4686',
    },
    token: tokens.link,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 11,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xc15fa3E22c912A276550F3E5FE3b0Deb87B55aCd',
    },
    token: tokens.usdt,
    quoteToken: tokens.busd,
  },
  {
    pid: 12,
    lpSymbol: 'TWT-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x610e7a287c27dfFcaC0F0a94f547Cc1B770cF483',
    },
    token: tokens.twt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 13,
    lpSymbol: 'XVS-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x41182c32F854dd97bA0e0B1816022e0aCB2fc0bb',
    },
    token: tokens.xvs,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 14,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x70D8929d04b60Af4fb9B58713eBcf18765aDE422',
    },
    token: tokens.eth,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 15,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x7561EEe90e24F3b348E1087A005F78B4c8453524',
    },
    token: tokens.btcb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 16,
    lpSymbol: 'ALPHA-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x4e0f3385d932F7179DeE045369286FFa6B03d887',
    },
    token: tokens.alpha,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 17,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x20bcc3b8a0091ddac2d0bc30f68e6cbb97de59cd',
    },
    token: tokens.usdt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 18,
    lpSymbol: 'XRP-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xc7b4b32a3be2cb6572a1c9959401f832ce47a6d2',
    },
    token: tokens.xrp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 19,
    lpSymbol: 'ATOM-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x2333c77fc0b2875c11409cdcd3c75d42d402e834',
    },
    token: tokens.atom,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 20,
    lpSymbol: 'YFII-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x574a978c2d0d36d707a05e459466c7a1054f1210',
    },
    token: tokens.yfii,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 21,
    lpSymbol: 'DAI-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x56c77d59e82f33c712f919d09fceddf49660a829',
    },
    token: tokens.dai,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 22,
    lpSymbol: 'XTZ-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x5acac332f0f49c8badc7afd0134ad19d3db972e6',
    },
    token: tokens.xtz,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 23,
    lpSymbol: 'BCH-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x54edd846db17f43b6e43296134ecd96284671e81',
    },
    token: tokens.bch,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 24,
    lpSymbol: 'YFI-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x68Ff2ca47D27db5Ac0b5c46587645835dD51D3C1',
    },
    token: tokens.yfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 25,
    lpSymbol: 'UNI-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x4269e7F43A63CEA1aD7707Be565a94a9189967E9',
    },
    token: tokens.uni,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 26,
    lpSymbol: 'FIL-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x35fe9787f0ebf2a200bac413d3030cf62d312774',
    },
    token: tokens.fil,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 27,
    lpSymbol: 'INJ-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x7a34bd64d18e44CfdE3ef4B81b87BAf3EB3315B6',
    },
    token: tokens.inj,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 29,
    lpSymbol: 'USDC-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x30479874f9320a62bce3bc0e315c920e1d73e278',
    },
    token: tokens.usdc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 30,
    lpSymbol: 'SXP-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x752E713fB70E3FA1Ac08bCF34485F14A986956c4',
    },
    token: tokens.sxp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 32,
    lpSymbol: 'CTK-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x7793870484647a7278907498ec504879d6971EAb',
    },
    token: tokens.ctk,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 34,
    lpSymbol: 'STAX-CAKE LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x7cd05f8b960ba071fdf69c750c0e5a57c8366500',
    },
    token: tokens.stax,
    quoteToken: tokens.cake,
    isCommunity: true,
  },
  {
    pid: 35,
    lpSymbol: 'NAR-CAKE LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x745c4fd226e169d6da959283275a8e0ecdd7f312',
    },
    token: tokens.nar,
    quoteToken: tokens.cake,
    isCommunity: true,
  },
  {
    pid: 36,
    lpSymbol: 'NYA-CAKE LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x2730bf486d658838464a4ef077880998d944252d',
    },
    token: tokens.nya,
    quoteToken: tokens.cake,
    isCommunity: true,
  },
  {
    pid: 38,
    lpSymbol: 'bROOBEE-CAKE LP',
    lpAddresses: {
      97: '',
      56: '0x970858016C963b780E06f7DCfdEf8e809919BcE8',
    },
    token: tokens.broobee,
    quoteToken: tokens.cake,
    isCommunity: true,
  },
  {
    pid: 8,
    lpSymbol: 'BAKE-BNB Bakery LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xc2eed0f5a0dc28cfa895084bc0a9b8b8279ae492',
    },
    token: tokens.bake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 9,
    lpSymbol: 'BURGER-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0xd937FB9E6e47F3805981453BFB277a49FFfE04D7',
    },
    token: tokens.burger,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 10,
    lpSymbol: 'BAKE-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x3Da30727ed0626b78C212e81B37B97A8eF8A25bB',
    },
    token: tokens.bake,
    quoteToken: tokens.wbnb,
  },
]

export default farms
