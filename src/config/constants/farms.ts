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
