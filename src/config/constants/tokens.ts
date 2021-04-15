const tokens = {
  bnb: {
    symbol: 'BNB',
    projectLink: 'https://www.binance.com/',
  },
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  txl: {
    symbol: 'TXL',
    address: {
      56: '0x1ffd0b47127fdd4097e54521c9e2c7f0d66aafc5',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://tixl.org/',
  },
  cos: {
    symbol: 'COS',
    address: {
      56: '0x96Dd399F9c3AFda1F194182F71600F1B65946501',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.contentos.io/',
  },
  bunny: {
    symbol: 'BUNNY',
    address: {
      56: '0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://pancakebunny.finance/',
  },
  alice: {
    symbol: 'ALICE',
    address: {
      56: '0xac51066d7bec65dc4589368da368b212745d63e8',
      97: '',
    },
    decimals: 6,
    projectLink: 'https://www.myneighboralice.com/',
  },
  for: {
    symbol: 'FOR',
    address: {
      56: '0x658A109C5900BC6d2357c87549B651670E5b0539',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.for.tube/home',
  },
  bux: {
    symbol: 'BUX',
    address: {
      56: '0x211ffbe424b90e25a15531ca322adf1559779e45',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://getbux.com/bux-crypto/',
  },
  nuls: {
    symbol: 'NULS',
    address: {
      56: '0x8cd6e29d3686d24d3c2018cee54621ea0f89313b',
      97: '',
    },
    decimals: 8,
    projectLink: 'https://www.nuls.io/',
  },
  belt: {
    symbol: 'BELT',
    address: {
      56: '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://beta.belt.fi/',
  },
  ramp: {
    symbol: 'RAMP',
    address: {
      56: '0x8519ea49c997f50ceffa444d240fb655e89248aa',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://rampdefi.com/',
  },
  bfi: {
    symbol: 'BFI',
    address: {
      56: '0x81859801b01764d4f0fa5e64729f5a6c3b91435b',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://bearn.fi/',
  },
  dexe: {
    symbol: 'DEXE',
    address: {
      56: '0x039cb485212f996a9dbb85a9a75d898f94d38da6',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://dexe.network/',
  },
  bel: {
    symbol: 'BEL',
    address: {
      56: '0x8443f091997f06a61670b735ed92734f5628692f',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://bella.fi/',
  },
  tpt: {
    symbol: 'TPT',
    address: {
      56: '0xeca41281c24451168a37211f0bc2b8645af45092',
      97: '',
    },
    decimals: 4,
    projectLink: 'https://www.tokenpocket.pro/',
  },
  watch: {
    symbol: 'WATCH',
    address: {
      56: '0x7a9f28eb62c791422aa23ceae1da9c847cbec9b0',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://yieldwatch.net/',
  },
  xmark: {
    symbol: 'xMARK',
    address: {
      56: '0x26a5dfab467d4f58fb266648cae769503cec9580',
      97: '',
    },
    decimals: 9,
    projectLink: 'https://benchmarkprotocol.finance/',
  },
  bmxx: {
    symbol: 'bMXX',
    address: {
      56: '0x4131b87f74415190425ccd873048c708f8005823',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://multiplier.finance/',
  },
  iotx: {
    symbol: 'IOTX',
    address: {
      56: '0x9678e42cebeb63f23197d726b29b1cb20d0064e5',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://iotex.io/',
  },
  bor: {
    symbol: 'BOR',
    address: {
      56: '0x92d7756c60dcfd4c689290e8a9f4d263b3b32241',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.boringdao.com/',
  },
  bopen: {
    symbol: 'bOPEN',
    address: {
      56: '0xf35262a9d427f96d2437379ef090db986eae5d42',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://opendao.io/',
  },
  dodo: {
    symbol: 'DODO',
    address: {
      56: '0x67ee3cb086f8a16f34bee3ca72fad36f7db929e2',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://dodoex.io/',
  },
  swingby: {
    symbol: 'SWINGBY',
    address: {
      56: '0x71de20e0c4616e7fcbfdd3f875d568492cbe4739',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://swingby.network/',
  },
  bry: {
    symbol: 'BRY',
    address: {
      56: '0xf859bf77cbe8699013d6dbc7c2b926aaf307f830',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://berrydata.co/',
  },
  zee: {
    symbol: 'ZEE',
    address: {
      56: '0x44754455564474a89358b2c2265883df993b12f0',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://zeroswap.io/',
  },
  swgb: {
    symbol: 'SWGb',
    address: {
      56: '0xe40255c5d7fa7ceec5120408c78c787cecb4cfdb',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://swirgepay.com/',
  },
  sfp: {
    symbol: 'SFP',
    address: {
      56: '0xd41fdb03ba84762dd66a0af1a6c8540ff1ba5dfb',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.safepal.io/',
  },
  lina: {
    symbol: 'LINA',
    address: {
      56: '0x762539b45a1dcce3d36d080f74d1aed37844b878',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://linear.finance/',
  },
  lit: {
    symbol: 'LIT',
    address: {
      56: '0xb59490ab09a0f526cc7305822ac65f2ab12f9723',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.litentry.com/',
  },
  hget: {
    symbol: 'HGET',
    address: {
      56: '0xc7d8d35eba58a0935ff2d5a33df105dd9f071731',
      97: '',
    },
    decimals: 6,
    projectLink: 'https://www.hedget.com/',
  },
  bdo: {
    symbol: 'BDO',
    address: {
      56: '0x190b589cf9fb8ddeabbfeae36a813ffb2a702454',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://bdollar.fi/',
  },
  egld: {
    symbol: 'EGLD',
    address: {
      56: '0xbf7c81fff98bbe61b40ed186e4afd6ddd01337fe',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://elrond.com/',
  },
  ust: {
    symbol: 'UST',
    address: {
      56: '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  wsote: {
    symbol: 'wSOTE',
    address: {
      56: '0x541e619858737031a1244a5d0cd47e5ef480342c',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://soteria.finance/#/',
  },
  front: {
    symbol: 'FRONT',
    address: {
      56: '0x928e55dab735aa8260af3cedada18b5f70c72f1b',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://frontier.xyz/',
  },
  helmet: {
    symbol: 'Helmet',
    address: {
      56: '0x948d2a81086a075b3130bac19e4c6dee1d2e3fe8',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.helmet.insure/',
  },
  btcst: {
    symbol: 'BTCST',
    address: {
      56: '0x78650b139471520656b9e7aa7a5e9276814a38e9',
      97: '',
    },
    decimals: 17,
    projectLink: 'https://www.1-b.tc/',
  },
  bscx: {
    symbol: 'BSCX',
    address: {
      56: '0x5ac52ee5b2a633895292ff6d8a89bb9190451587',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://bscex.org/',
  },
  ten: {
    symbol: 'TEN',
    address: {
      56: '0xdff8cb622790b7f92686c722b02cab55592f152c',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.tenet.farm/',
  },
  balbt: {
    symbol: 'bALBT',
    address: {
      56: '0x72faa679e1008ad8382959ff48e392042a8b06f7',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://allianceblock.io/',
  },
  asr: {
    symbol: 'ASR',
    address: {
      56: '0x80d5f92c2c8c682070c95495313ddb680b267320',
      97: '',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  atm: {
    symbol: 'ATM',
    address: {
      56: '0x25e9d05365c867e59c1904e7463af9f312296f9e',
      97: '',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  og: {
    symbol: 'OG',
    address: {
      56: '0xf05e45ad22150677a017fbd94b84fbb63dc9b44c',
      97: '',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  reef: {
    symbol: 'REEF',
    address: {
      56: '0xf21768ccbc73ea5b6fd3c687208a7c2def2d966e',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://reef.finance/',
  },
  ditto: {
    symbol: 'DITTO',
    address: {
      56: '0x233d91a0713155003fc4dce0afa871b508b3b715',
      97: '',
    },
    decimals: 9,
    projectLink: 'https://ditto.money/',
  },
  juv: {
    symbol: 'JUV',
    address: {
      56: '0xc40c9a843e1c6d01b7578284a9028854f6683b1b',
      97: '',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  psg: {
    symbol: 'PSG',
    address: {
      56: '0xbc5609612b7c44bef426de600b5fd1379db2ecf1',
      97: '',
    },
    decimals: 2,
    projectLink: 'https://www.chiliz.com',
  },
  vai: {
    symbol: 'VAI',
    address: {
      56: '0x4bd17003473389a42daf6a0a729f6fdb328bbbd7',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  blink: {
    symbol: 'BLINK',
    address: {
      56: '0x63870a18b6e42b01ef1ad8a2302ef50b7132054f',
      97: '',
    },
    decimals: 6,
    projectLink: 'https://blink.wink.org',
  },
  unfi: {
    symbol: 'UNFI',
    address: {
      56: '0x728c5bac3c3e370e372fc4671f9ef6916b814d8b',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://unifiprotocol.com',
  },
  twt: {
    symbol: 'TWT',
    address: {
      56: '0x4b0f1812e5df2a09796481ff14017e6005508003',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://trustwallet.com/',
  },
  hard: {
    symbol: 'HARD',
    address: {
      56: '0xf79037f6f6be66832de4e7516be52826bc3cbcc4',
      97: '',
    },
    decimals: 6,
    projectLink: 'https://hard.kava.io',
  },
  broobee: {
    symbol: 'bROOBEE',
    address: {
      56: '0xe64f5cb844946c1f102bd25bbd87a5ab4ae89fbe',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://roobee.io/',
  },
  stax: {
    symbol: 'STAX',
    address: {
      56: '0x0da6ed8b13214ff28e9ca979dd37439e8a88f6c4',
      97: '',
    },
    decimals: 18,
    projectLink: 'http://stablexswap.com/',
  },
  nar: {
    symbol: 'NAR',
    address: {
      56: '0xa1303e6199b319a891b79685f0537d289af1fc83',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://narwhalswap.org/',
  },
  nya: {
    symbol: 'NYA',
    address: {
      56: '0xbfa0841f7a90c4ce6643f651756ee340991f99d5',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://nyanswop.org/',
  },
  ctk: {
    symbol: 'CTK',
    address: {
      56: '0xa8c2b8eec3d368c0253ad3dae65a5f2bbb89c929',
      97: '',
    },
    decimals: 6,
    projectLink: 'https://www.certik.foundation/',
  },
  inj: {
    symbol: 'INJ',
    address: {
      56: '0xa2b726b1145a4773f68593cf171187d8ebe4d495',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://injectiveprotocol.com/',
  },
  sxp: {
    symbol: 'SXP',
    address: {
      56: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://swipe.io/',
  },
  alpha: {
    symbol: 'ALPHA',
    address: {
      56: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://alphafinance.io/',
  },
  xvs: {
    symbol: 'XVS',
    address: {
      56: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  sushi: {
    symbol: 'SUSHI',
    address: {
      56: '0x947950bcc74888a40ffa2593c5798f11fc9124c4',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://sushi.com/',
  },
  comp: {
    symbol: 'COMP',
    address: {
      56: '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://compound.finance/',
  },
  syrup: {
    symbol: 'SYRUP',
    address: {
      56: '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
      97: '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  bifi: {
    symbol: 'BIFI',
    address: {
      56: '0xca3f508b8e4dd382ee878a314789373d80a5190a',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://beefy.finance/',
  },
  dusk: {
    symbol: 'DUSK',
    address: {
      56: '0xb2bd0749dbe21f623d9baba856d3b0f0e1bfec9c',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://dusk.network/',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
  },
  eth: {
    symbol: 'ETH',
    address: {
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/',
  },
  beth: {
    symbol: 'BETH',
    address: {
      56: '0x250632378e573c6be1ac2f97fcdf00515d0aa91b',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/eth2/beacon-chain/',
  },
  mamzn: {
    symbol: 'mAMZN',
    address: {
      56: '0x3947B992DC0147D2D89dF0392213781b04B25075',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  mgoogl: {
    symbol: 'mGOOGL',
    address: {
      56: '0x62D71B23bF15218C7d2D7E48DBbD9e9c650B173f',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  mnflx: {
    symbol: 'mNFLX',
    address: {
      56: '0xa04F060077D90Fe2647B61e4dA4aD1F97d6649dc',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  mtsla: {
    symbol: 'mTSLA',
    address: {
      56: '0xF215A127A196e3988C09d052e16BcFD365Cd7AA3',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  ltc: {
    symbol: 'LTC',
    address: {
      56: '0x4338665cbb7b2485a8855a139b75d5e34ab0db94',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://litecoin.org/',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.centre.io/usdc',
  },
  dai: {
    symbol: 'DAI',
    address: {
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      97: '',
    },
    decimals: 18,
    projectLink: 'http://www.makerdao.com/',
  },
  ada: {
    symbol: 'ADA',
    address: {
      56: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://www.cardano.org/',
  },
  band: {
    symbol: 'BAND',
    address: {
      56: '0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bandprotocol.com/',
  },
  dot: {
    symbol: 'DOT',
    address: {
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://polkadot.network/',
  },
  eos: {
    symbol: 'EOS',
    address: {
      56: '0x56b6fb708fc5732dec1afc8d8556423a2edccbd6',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://eos.io/',
  },
  link: {
    symbol: 'LINK',
    address: {
      56: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://chain.link/',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x55d398326f99059ff775485246999027b3197955',
    },
    decimals: 18,
    projectLink: 'https://tether.to/',
  },
  btcb: {
    symbol: 'BTCB',
    address: {
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bitcoin.org/',
  },
  xrp: {
    symbol: 'XRP',
    address: {
      56: '0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://ripple.com/xrp/',
  },
  atom: {
    symbol: 'ATOM',
    address: {
      56: '0x0eb3a705fc54725037cc9e008bdede697f62f335',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://cosmos.network/',
  },
  yfii: {
    symbol: 'YFII',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x7f70642d88cf1c4a3a7abb072b53b929b653eda5',
    },
    decimals: 18,
    projectLink: 'https://dfi.money/#/',
  },
  xtz: {
    symbol: 'XTZ',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x16939ef78684453bfdfb47825f8a5f714f12623a',
    },
    decimals: 18,
    projectLink: 'https://www.tezos.com/',
  },
  bch: {
    symbol: 'BCH',
    address: {
      56: '0x8ff795a6f4d97e7887c79bea79aba5cc76444adf',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'http://bch.info/',
  },
  yfi: {
    symbol: 'YFI',
    address: {
      56: '0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://yearn.finance/',
  },
  uni: {
    symbol: 'UNI',
    address: {
      56: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://uniswap.org/',
  },
  fil: {
    symbol: 'FIL',
    address: {
      56: '0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://filecoin.io/',
  },
  bake: {
    symbol: 'BAKE',
    address: {
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://www.bakeryswap.org/',
  },
  burger: {
    symbol: 'BURGER',
    address: {
      56: '0xae9269f27437f0fcbc232d39ec814844a51d6b8f',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://burgerswap.org/',
  },
  bdigg: {
    symbol: 'bDIGG',
    address: {
      56: '0x5986d5c77c65e5801a5caa4fae80089f870a71da',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://badger.finance/',
  },
  bbadger: {
    symbol: 'bBadger',
    address: {
      56: '0x1f7216fdb338247512ec99715587bb97bbf96eae',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://badger.finance/',
  },
  trade: {
    symbol: 'TRADE',
    address: {
      56: '0x7af173f350d916358af3e218bdf2178494beb748',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://unitrade.app/',
  },
  pnt: {
    symbol: 'PNT',
    address: {
      56: '0x7a1da9f49224ef98389b071b8a3294d1cc5e3e6a',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ptokens.io/',
  },
  mir: {
    symbol: 'MIR',
    address: {
      56: '0x5b6dcf557e2abe2323c48445e8cc948910d8c2c9',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://mirror.finance/',
  },
  pbtc: {
    symbol: 'pBTC',
    address: {
      56: '0xed28a457a5a76596ac48d87c0f577020f6ea1c4c',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ptokens.io/',
  },
  lto: {
    symbol: 'LTO',
    address: {
      56: '0x857b222fc79e1cbbf8ca5f78cb133d1b7cf34bbd',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ltonetwork.com/',
  },
  pcws: {
    symbol: 'pCWS',
    address: {
      56: '0xbcf39f0edda668c58371e519af37ca705f2bfcbd',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://game.seascape.network/',
  },
  zil: {
    symbol: 'ZIL',
    address: {
      56: '0xb86abcb37c3a4b64f74f59301aff131a1becc787',
      97: '',
    },
    decimals: 12,
    projectLink: 'https://www.zilliqa.com/',
  },
  lien: {
    symbol: 'LIEN',
    address: {
      56: '0x5d684adaf3fcfe9cfb5cede3abf02f0cdd1012e3',
      97: '',
    },
    decimals: 8,
    projectLink: 'https://lien.finance/',
  },
  swth: {
    symbol: 'SWTH',
    address: {
      56: '0x250b211EE44459dAd5Cd3bCa803dD6a7EcB5d46C',
      97: '',
    },
    decimals: 8,
    projectLink: 'https://switcheo.network/',
  },
  dft: {
    symbol: 'DFT',
    address: {
      56: '0x42712dF5009c20fee340B245b510c0395896cF6e',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.dfuture.com/home',
  },
  gum: {
    symbol: 'GUM',
    address: {
      56: '0xc53708664b99DF348dd27C3Ac0759d2DA9c40462',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://gourmetgalaxy.io/',
  },
  dego: {
    symbol: 'DEGO',
    address: {
      56: '0x3fda9383a84c05ec8f7630fe10adf1fac13241cc',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://bsc.dego.finance/home',
  },
  nrv: {
    symbol: 'NRV',
    address: {
      56: '0x42f6f551ae042cbe50c739158b4f0cac0edb9096',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://nerve.fi/',
  },
  easy: {
    symbol: 'EASY',
    address: {
      56: '0x7c17c8bed8d14bacce824d020f994f4880d6ab3b',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://easyfi.network/',
  },
  oddz: {
    symbol: 'ODDZ',
    address: {
      56: '0xcd40f2670cf58720b694968698a5514e924f742d',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://oddz.fi/',
  },
  hoo: {
    symbol: 'HOO',
    address: {
      56: '0xe1d1f66215998786110ba0102ef558b22224c016',
      97: '',
    },
    decimals: 8,
    projectLink: 'https://hoo.com/',
  },
  apys: {
    symbol: 'APYS',
    address: {
      56: '0x37dfACfaeDA801437Ff648A1559d73f4C40aAcb7',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://apyswap.com/',
  },
  bondly: {
    symbol: 'BONDLY',
    address: {
      56: '0x96058f8c3e16576d9bd68766f3836d9a33158f89',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.bondly.finance/',
  },
  tko: {
    symbol: 'TKO',
    address: {
      56: '0x9f589e3eabe42ebc94a44727b3f3531c0c877809',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.tokocrypto.com/',
  },
  itam: {
    symbol: 'ITAM',
    address: {
      56: '0x04c747b40be4d535fc83d09939fb0f626f32800b',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://itam.network/',
  },
  arpa: {
    symbol: 'ARPA',
    address: {
      56: '0x6f769e65c14ebd1f68817f5f1dcdb61cfa2d6f7e',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://arpachain.io/',
  },
  eps: {
    symbol: 'EPS',
    address: {
      56: '0xa7f552078dcc247c2684336020c03648500c6d9f',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ellipsis.finance/',
  },
  jgn: {
    symbol: 'JGN',
    address: {
      56: '0xc13b7a43223bb9bf4b69bd68ab20ca1b79d81c75',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://jgndefi.com/',
  },
  tlm: {
    symbol: 'TLM',
    address: {
      56: '0x2222227e22102fe3322098e4cbfe18cfebd57c95',
      97: '',
    },
    decimals: 4,
    projectLink: 'https://alienworlds.io/',
  },
  perl: {
    symbol: 'PERL',
    address: {
      56: '0x0f9e4d49f25de22c2202af916b681fbb3790497b',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://perlinx.finance/',
  },
  alpa: {
    symbol: 'ALPA',
    address: {
      56: '0xc5e6689c9c8b02be7c49912ef19e79cf24977f03',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://bsc.alpaca.city/',
  },
  hzn: {
    symbol: 'HZN',
    address: {
      56: '0xc0eff7749b125444953ef89682201fb8c6a917cd',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://horizonprotocol.com/',
  },
}

export default tokens
