import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
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
    pid: 251,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 252,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
  {
    pid: 450,
    lpSymbol: 'SFUND-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x74fA517715C4ec65EF01d55ad5335f90dce7CC87',
    },
    token: tokens.sfund,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 449,
    lpSymbol: 'BP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2bF2dEB40639201C9A94c9e33b4852D9AEa5fd2D',
    },
    token: tokens.bp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 448,
    lpSymbol: 'RUSD-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x59FaC9e98479fc9979aE2a0C7422Af50bCBB9B26',
    },
    token: tokens.rusd,
    quoteToken: tokens.busd,
  },
  {
    pid: 447,
    lpSymbol: 'GNT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3747e3e107223539FD09bb730b055A1f11F78Adf',
    },
    token: tokens.gnt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 446,
    lpSymbol: 'BMON-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x00e53C169dA54a7E11172aEEDf8Eb87F060F479e',
    },
    token: tokens.bmon,
    quoteToken: tokens.busd,
  },
  {
    pid: 317,
    lpSymbol: 'RAMP-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xE834bf723f5bDff34a5D1129F3c31Ea4787Bc76a',
    },
    token: tokens.ramp,
    quoteToken: tokens.busd,
  },
  {
    pid: 445,
    lpSymbol: 'POTS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xF90BAA331Cfd40F094476E752Bf272892170d399',
    },
    token: tokens.pots,
    quoteToken: tokens.busd,
  },
  {
    pid: 397,
    lpSymbol: 'TUSD-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x2e28b9b74d6d99d4697e913b82b41ef1cac51c6c',
    },
    token: tokens.tusd,
    quoteToken: tokens.busd,
  },
  {
    pid: 443,
    lpSymbol: 'BTT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xdcfbb12ded3fea12d2a078bc6324131cd14bf835',
    },
    token: tokens.btt,
    quoteToken: tokens.busd,
  },
  {
    pid: 442,
    lpSymbol: 'TRX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xb5d108578be3750209d1b3a8f45ffee8c5a75146',
    },
    token: tokens.trx,
    quoteToken: tokens.busd,
  },
  {
    pid: 441,
    lpSymbol: 'WIN-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6a445ceb72c8b1751755386c3990055ff92e14a0',
    },
    token: tokens.win,
    quoteToken: tokens.busd,
  },
  {
    pid: 436,
    lpSymbol: 'BABYCAKE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xb5e33fE13a821e55ED33C884589a804B1b4F6fD8',
    },
    token: tokens.babycake,
    quoteToken: tokens.wbnb,
    isCommunity: true,
  },
  {
    pid: 437,
    lpSymbol: 'BMON-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3C2b7B578Dd2175A1c3524Aa0D515106282Bf108',
    },
    token: tokens.bmon,
    quoteToken: tokens.wbnb,
    isCommunity: true,
  },
  {
    pid: 440,
    lpSymbol: 'HERO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe267018C943E77992e7e515724B07b9CE7938124',
    },
    token: tokens.hero,
    quoteToken: tokens.wbnb,
    isCommunity: true,
  },
  {
    pid: 438,
    lpSymbol: 'WSG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x37Ff7D4459ad96E0B01275E5efffe091f33c2CAD',
    },
    token: tokens.wsg,
    quoteToken: tokens.wbnb,
    isCommunity: true,
  },
  {
    pid: 439,
    lpSymbol: 'MCRN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe8D5d81dac092Ae61d097f84EFE230759BF2e522',
    },
    token: tokens.mcrn,
    quoteToken: tokens.wbnb,
    isCommunity: true,
  },
  {
    pid: 435,
    lpSymbol: 'REVV-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1cc18962b919ef90085a8b21f8ddc95824fbad9e',
    },
    token: tokens.revv,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 367,
    lpSymbol: 'BTT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x946696344e7d4346b223e1cf77035a76690d6a73',
    },
    token: tokens.btt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 434,
    lpSymbol: 'SKILL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc19dfd34d3ba5816df9cbdaa02d32a9f8dc6f6fc',
    },
    token: tokens.skill,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 369,
    lpSymbol: 'WIN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x894bd57afd8efc93d9171cb585d11d0977557425',
    },
    token: tokens.win,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 433,
    lpSymbol: 'IF-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7b4682D2B3f8670b125aF6AEA8d7eD2Daa43Bdc1',
    },
    token: tokens.if,
    quoteToken: tokens.busd,
  },
  {
    pid: 432,
    lpSymbol: 'SPS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xfdfde3af740a22648b9dd66d05698e5095940850',
    },
    token: tokens.sps,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 431,
    lpSymbol: 'C98-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x92247860A03F48d5c6425c7CA35CDcFCB1013AA1',
    },
    token: tokens.c98,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 430,
    lpSymbol: 'AXS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xC2d00De94795e60FB76Bc37d899170996cBdA436',
    },
    token: tokens.axs,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 379,
    lpSymbol: 'PMON-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xcdb0016d97fd0e7ec2c3b78aa4786cbd8e19c14c',
    },
    token: tokens.pmon,
    quoteToken: tokens.busd,
  },
  {
    pid: 368,
    lpSymbol: 'TRX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3cd338c3bb249b6b3c55799f85a589febbbff9dd',
    },
    token: tokens.trx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 429,
    lpSymbol: 'CHESS-USDC LP',
    lpAddresses: {
      97: '',
      56: '0x1472976e0b97f5b2fc93f1fff14e2b5c4447b64f',
    },
    token: tokens.chess,
    quoteToken: tokens.usdc,
  },
  {
    pid: 428,
    lpSymbol: 'TITAN-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x9392a1f471d9aa14c0b8eb28bd7a3f4a814727be',
    },
    token: tokens.titan,
    quoteToken: tokens.busd,
  },
  {
    pid: 427,
    lpSymbol: 'ONE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9d2296e2fe3cdbf2eb3e3e2ca8811bafa42eedff',
    },
    token: tokens.harmony,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 426,
    lpSymbol: 'MASK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x46c6bA71af7648cD7f67D0AD4d16f75bE251ed12',
    },
    token: tokens.mask,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 425,
    lpSymbol: 'DVI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x89ebf9cd99864f6e51bd7a578965922029cab977',
    },
    token: tokens.dvi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 339,
    lpSymbol: 'GUM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x28Ea5894D4DBbE90bB58eE3BAB2869387d711c87',
    },
    token: tokens.gum,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 424,
    lpSymbol: 'ADX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x0648ff5de80adf54aac07ece2490f50a418dde23',
    },
    token: tokens.adx,
    quoteToken: tokens.busd,
  },
  {
    pid: 423,
    lpSymbol: 'USDC-USDT LP',
    lpAddresses: {
      97: '',
      56: '0xec6557348085aa57c72514d67070dc863c0a5a8c',
    },
    token: tokens.usdc,
    quoteToken: tokens.usdt,
  },
  {
    pid: 422,
    lpSymbol: 'CAKE-USDT LP',
    lpAddresses: {
      97: '',
      56: '0xA39Af17CE4a8eb807E076805Da1e2B8EA7D0755b',
    },
    token: tokens.cake,
    quoteToken: tokens.usdt,
  },
  {
    pid: 357,
    lpSymbol: 'SUTER-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2d5DB889392Bc3c8B023A8631ca230A033eEA1B8',
    },
    token: tokens.suter,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 421,
    lpSymbol: 'BSCPAD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xba01662e978de7d67f8ffc937726215eb8995d17',
    },
    token: tokens.bscpad,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 420,
    lpSymbol: 'RABBIT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x04b56A5B3f45CFeaFbfDCFc999c14be5434f2146',
    },
    token: tokens.rabbit,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 419,
    lpSymbol: 'WAULTx-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3e4370204f598205998143F07ebCC486E441b456',
    },
    token: tokens.waultx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 418,
    lpSymbol: 'WEX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x547A355E70cd1F8CAF531B950905aF751dBEF5E6',
    },
    token: tokens.wex,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 417,
    lpSymbol: 'FORM-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3E19C18Fe3458A6065D8F0844cB7Eae52C9DAE07',
    },
    token: tokens.form,
    quoteToken: tokens.busd,
  },
  {
    pid: 416,
    lpSymbol: 'ORBS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xB87b857670A44356f2b70337E0F218713D2378e8',
    },
    token: tokens.orbs,
    quoteToken: tokens.busd,
  },
  {
    pid: 415,
    lpSymbol: 'DG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8b2824d57eebf07f5aff5c91fa67ed7c501a9f43',
    },
    token: tokens.$dg,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 414,
    lpSymbol: 'WOO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x89eE0491CE55d2f7472A97602a95426216167189',
    },
    token: tokens.woo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 413,
    lpSymbol: 'HTB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2a995d355d5df641e878c0f366685741fd18d004',
    },
    token: tokens.htb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 351,
    lpSymbol: 'JGN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7275278C94b5e20708380561C4Af98F38dDC6374',
    },
    token: tokens.jgn,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 337,
    lpSymbol: 'DFT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x24d3B0eD4C444A4f6882d527cBF67aDc8c026582',
    },
    token: tokens.dft,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 412,
    lpSymbol: 'HAI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x289841bFb694767bCb56fBc7B741aB4B4D97D490',
    },
    token: tokens.hai,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 411,
    lpSymbol: 'O3-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7759283571Da8c0928786A96AE601944E10461Ff',
    },
    token: tokens.o3,
    quoteToken: tokens.busd,
  },
  {
    pid: 410,
    lpSymbol: 'AMPL-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6e98beb694ff1cdb1ee130edd2b21b0298683d58',
    },
    token: tokens.ampl,
    quoteToken: tokens.busd,
  },
  {
    pid: 343,
    lpSymbol: 'ODDZ-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3c2c77353E2F6AC1578807b6b2336Bf3a3CbB014',
    },
    token: tokens.oddz,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 409,
    lpSymbol: 'ETH-USDC LP',
    lpAddresses: {
      97: '',
      56: '0xEa26B78255Df2bBC31C1eBf60010D78670185bD0',
    },
    token: tokens.eth,
    quoteToken: tokens.usdc,
  },
  {
    pid: 408,
    lpSymbol: 'BTCB-ETH LP',
    lpAddresses: {
      97: '',
      56: '0xD171B26E4484402de70e3Ea256bE5A2630d7e88D',
    },
    token: tokens.btcb,
    quoteToken: tokens.eth,
  },
  {
    pid: 347,
    lpSymbol: 'BONDLY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xb8b4383B49d451BBeA63BC4421466E1086da6f18',
    },
    token: tokens.bondly,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 407,
    lpSymbol: 'MARSH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x222f93187f15f354d41ff6a7703ef7e18cdd5103',
    },
    token: tokens.marsh,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 406,
    lpSymbol: 'BORING-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xDfA808Da5CFB9ABA5Fb3748FF85888F79174F378',
    },
    token: tokens.boring,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 405,
    lpSymbol: 'MBOX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8FA59693458289914dB0097F5F366d771B7a7C3F',
    },
    token: tokens.mbox,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 404,
    lpSymbol: 'ATA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xef7767677867552cfa699148b96a03358a9be779',
    },
    token: tokens.ata,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 403,
    lpSymbol: 'MX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x41f049d990d38305504631c9835f6f856bf1ba67',
    },
    token: tokens.mx,
    quoteToken: tokens.busd,
  },
  {
    pid: 402,
    lpSymbol: 'bCFX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xA0387eBeA6be90849c2261b911fBBD52B4C9eAC4',
    },
    token: tokens.bcfx,
    quoteToken: tokens.busd,
  },
  {
    pid: 401,
    lpSymbol: 'QKC-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8853e3309a31583ea438f7704681f46f0d4d909b',
    },
    token: tokens.qkc,
    quoteToken: tokens.busd,
  },
  {
    pid: 400,
    lpSymbol: 'KTN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x48028de4a9b0d3d91180333d796021ec7757ba1b',
    },
    token: tokens.ktn,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 399,
    lpSymbol: 'MTRG-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x4dcA4D427511bC327639b222DA18FA5e334F686F',
    },
    token: tokens.mtrg,
    quoteToken: tokens.busd,
  },
  {
    pid: 398,
    lpSymbol: 'SWG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x226af4e918fcf3e62e5eeec867a3e78aaa7bb01d',
    },
    token: tokens.swg,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 396,
    lpSymbol: 'VRT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xef5212ada83ec2cc105c409df10b8806d20e3b35',
    },
    token: tokens.vrt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 395,
    lpSymbol: 'EZ-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x51bf99bbae59b67e5ce2fa9c17b683384773f8b3',
    },
    token: tokens.ez,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 394,
    lpSymbol: 'KALM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc74f7243766269dec5b85b0ef4af186e909c1b06',
    },
    token: tokens.kalm,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 393,
    lpSymbol: 'pOPEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1090c996fd1490d15dd7906322ee676a5cc3cf82',
    },
    token: tokens.popen,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 335,
    lpSymbol: 'LIEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xa4963B38b271c0D714593063497Fc786Fa4029Ce',
    },
    token: tokens.lien,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 392,
    lpSymbol: 'WELL-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x1d94cb25895abd6ccfef863c53372bb462aa6b86',
    },
    token: tokens.well,
    quoteToken: tokens.busd,
  },
  {
    pid: 391,
    lpSymbol: 'DERI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xdc7188ac11e124b1fa650b73ba88bf615ef15256',
    },
    token: tokens.deri,
    quoteToken: tokens.busd,
  },
  {
    pid: 390,
    lpSymbol: 'CHR-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6045931e511ef7e53a4a817f971e0ca28c758809',
    },
    token: tokens.chr,
    quoteToken: tokens.busd,
  },
  {
    pid: 389,
    lpSymbol: 'CAKE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x804678fa97d91B974ec2af3c843270886528a9E6',
    },
    token: tokens.cake,
    quoteToken: tokens.busd,
  },
  {
    pid: 388,
    lpSymbol: 'CYC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xecf30fbecfa642012f54212a3be92eef1e48edac',
    },
    token: tokens.cyc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 387,
    lpSymbol: 'XEND-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xcecfc2789af72ed151589a96a59f3a1abc65c3b5',
    },
    token: tokens.xend,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 296,
    lpSymbol: 'HGET-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xF74ee1e10e097dc326a2ad004F9Cc95CB71088d3',
    },
    token: tokens.hget,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 386,
    lpSymbol: 'HOTCROSS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xf23bad605e94de0e3b60c9718a43a94a5af43915',
    },
    token: tokens.hotcross,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 385,
    lpSymbol: 'RFOX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8e04b3972b5c25766c681dfd30a8a1cbf6dcc8c1',
    },
    token: tokens.rfox,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 384,
    lpSymbol: 'WMASS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xec95ff6281c3ad8e27372fa6675eb337640b8e5e',
    },
    token: tokens.wmass,
    quoteToken: tokens.busd,
  },
  {
    pid: 383,
    lpSymbol: 'UBXT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8d3ff27d2ad6a9556b7c4f82f4d602d20114bc90',
    },
    token: tokens.ubxt,
    quoteToken: tokens.busd,
  },
  {
    pid: 381,
    lpSymbol: 'BTR-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xbc7ac609fa730239190a70952e64ee1dfc2530ac',
    },
    token: tokens.btr,
    quoteToken: tokens.busd,
  },
  {
    pid: 380,
    lpSymbol: 'τDOGE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x2030845Ce7d4224523fd2F03Ca20Afe4aAD1D890',
    },
    token: tokens.τdoge,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 378,
    lpSymbol: 'ONE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x4d057f769d930eafd597b49d6fb2e1009a73a702',
    },
    token: tokens.one,
    quoteToken: tokens.busd,
  },
  {
    pid: 377,
    lpSymbol: 'FINE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc309a6d2f1537922e06f15aa2eb21caa1b2eedb6',
    },
    token: tokens.fine,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 376,
    lpSymbol: 'DOGE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xac109c8025f272414fd9e2faa805a583708a017f',
    },
    token: tokens.doge,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 310,
    lpSymbol: 'bMXX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc20A92a1424b29b78DFaF92FD35D4cf8A06419B4',
    },
    token: tokens.bmxx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 375,
    lpSymbol: 'OIN-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6a00e41561ac36a78dba1d09091b0f00c4e53724',
    },
    token: tokens.oin,
    quoteToken: tokens.busd,
  },
  {
    pid: 374,
    lpSymbol: 'HYFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0716725d78081a9e0e1ff81516f5415b399e274d',
    },
    token: tokens.hyfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 373,
    lpSymbol: 'KUN-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xea61020e5a128d2bec67d48f7cfbe3408db7e391',
    },
    token: tokens.kun,
    quoteToken: tokens.busd,
  },
  {
    pid: 372,
    lpSymbol: 'KUN-QSD LP',
    lpAddresses: {
      97: '',
      56: '0x4eafbf68a2d50291ffd163d4e00ad0f040aae707',
    },
    token: tokens.kun,
    quoteToken: tokens.qsd,
  },
  {
    pid: 371,
    lpSymbol: 'MATH-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xb7cada0f120ca46745a024e6b9fe907b2fe10cf3',
    },
    token: tokens.math,
    quoteToken: tokens.busd,
  },
  {
    pid: 370,
    lpSymbol: 'mCOIN-UST LP',
    lpAddresses: {
      97: '',
      56: '0xbcf01a42f6bc42f3cfe81b05519565044d65d22a',
    },
    token: tokens.mcoin,
    quoteToken: tokens.ust,
  },
  {
    pid: 366,
    lpSymbol: 'PNT-pBTC LP',
    lpAddresses: {
      97: '',
      56: '0xdaa89d335926628367b47852989bb22ee62ca5de',
    },
    token: tokens.pnt,
    quoteToken: tokens.pbtc,
  },
  {
    pid: 311,
    lpSymbol: 'xMARK-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xAa40f1AC20AAFcFEE8595Da606D78C503C7e70A3',
    },
    token: tokens.xmark,
    quoteToken: tokens.busd,
  },
  {
    pid: 365,
    lpSymbol: 'BTCB-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xf45cd219aef8618a92baa7ad848364a158a24f33',
    },
    token: tokens.btcb,
    quoteToken: tokens.busd,
  },
  {
    pid: 364,
    lpSymbol: 'LMT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8271d7eafeeb8f24d7c9fe1acce2ae20611972e5',
    },
    token: tokens.lmt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 363,
    lpSymbol: 'DFD-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x029d66f9c0469450b7b4834b8ddc6a1118cec3e1',
    },
    token: tokens.dfd,
    quoteToken: tokens.busd,
  },
  {
    pid: 362,
    lpSymbol: 'ALPACA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7752e1fa9f3a2e860856458517008558deb989e3',
    },
    token: tokens.alpaca,
    quoteToken: tokens.busd,
  },
  {
    pid: 361,
    lpSymbol: 'τBTC-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0x8046fa66753928F35f7Db23ae0188ee6743C2FBA',
    },
    token: tokens.τbtc,
    quoteToken: tokens.btcb,
  },
  {
    pid: 304,
    lpSymbol: 'SWINGBY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4Fd6D315bEf387fAD2322fbc64368fC443F0886D',
    },
    token: tokens.swingby,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 360,
    lpSymbol: 'XED-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xa7A0b605343dF36B748FF4B5f7578b3F2D0651CE',
    },
    token: tokens.xed,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 359,
    lpSymbol: 'HAKKA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x2C624C9Ecf16Cb81aB85cC2C0B0c5e12A09AFDa6',
    },
    token: tokens.hakka,
    quoteToken: tokens.busd,
  },
  {
    pid: 358,
    lpSymbol: 'CGG-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0604471c532F9fEBAD3E37190B667f44BD0894b3',
    },
    token: tokens.cgg,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 356,
    lpSymbol: 'bROOBEE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x950FD020F8E4B8C57285EC7020b7a204348dadFa',
    },
    token: tokens.broobee,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 355,
    lpSymbol: 'HZN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xDc9a574b9B341D4a98cE29005b614e1E27430E74',
    },
    token: tokens.hzn,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 354,
    lpSymbol: 'ALPA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4cC442220BE1cE560C1f2573f8CA8f460B3E4172',
    },
    token: tokens.alpa,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 353,
    lpSymbol: 'PERL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61010e6CbA3b56ba47E9dFd56Da682daCFe76131',
    },
    token: tokens.perl,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 352,
    lpSymbol: 'TLM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xE6b421a4408c82381b226Ab5B6F8C4b639044359',
    },
    token: tokens.tlm,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 350,
    lpSymbol: 'EPS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xddE420cbB3794ebD8FFC3Ac69F9c78e5d1411870',
    },
    token: tokens.eps,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 349,
    lpSymbol: 'ARPA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9730c791743300E9f984C9264395ce705A55Da7c',
    },
    token: tokens.arpa,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 348,
    lpSymbol: 'ITAM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd02DA76c813b9cd4516eD50442923E625f90228f',
    },
    token: tokens.itam,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 346,
    lpSymbol: 'TKO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xFFd4B200d3C77A0B691B5562D804b3bd54294e6e',
    },
    token: tokens.tko,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 345,
    lpSymbol: 'APYS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x510b29a93ebf098f3fC24A16541aAA0114D07056',
    },
    token: tokens.apys,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 344,
    lpSymbol: 'HOO-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3e42C1f7239231E3752B507764445dd8e6A570d5',
    },
    token: tokens.hoo,
    quoteToken: tokens.busd,
  },
  {
    pid: 342,
    lpSymbol: 'EASY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x20c6De8983Fb2D641c55004646aEF40b4EA66E18',
    },
    token: tokens.easy,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 341,
    lpSymbol: 'NRV-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xE482249Cd295C0d1e9D2baAEE71e66de21024C68',
    },
    token: tokens.nrv,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 340,
    lpSymbol: 'DEGO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xF1Ec67fA1881796BFf63Db3E1A301cE9cb787Fad',
    },
    token: tokens.dego,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 338,
    lpSymbol: 'pBTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x0362ba706DFE8ED12Ec1470aB171d8Dcb1C72B8D',
    },
    token: tokens.pbtc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 336,
    lpSymbol: 'SWTH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x123D475E13aA54A43a7421d94CAa4459dA021c77',
    },
    token: tokens.swth,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 334,
    lpSymbol: 'ZIL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6A97867a4b7Eb7646ffB1F359ad582e9903aa1C2',
    },
    token: tokens.zil,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 333,
    lpSymbol: 'pCWS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x6615CE60D71513aA4849269dD63821D324A23F8C',
    },
    token: tokens.pcws,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 332,
    lpSymbol: 'bBADGER-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0x5A58609dA96469E9dEf3fE344bC39B00d18eb9A5',
    },
    token: tokens.bbadger,
    quoteToken: tokens.btcb,
  },
  {
    pid: 331,
    lpSymbol: 'bDIGG-BTCB LP',
    lpAddresses: {
      97: '',
      56: '0x81d776C90c89B8d51E9497D58338933127e2fA80',
    },
    token: tokens.bdigg,
    quoteToken: tokens.btcb,
  },
  {
    pid: 330,
    lpSymbol: 'LTO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xa5Bb44c6F5fD9B836E5a654c8AbbCCc96A15deE5',
    },
    token: tokens.lto,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 329,
    lpSymbol: 'MIR-UST LP',
    lpAddresses: {
      97: '',
      56: '0x89666d026696660e93Bf6edf57B71A68615768B7',
    },
    token: tokens.mir,
    quoteToken: tokens.ust,
  },
  {
    pid: 328,
    lpSymbol: 'TRADE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8F6baf368E7A4f6e2C9c995f22702d5e654A0237',
    },
    token: tokens.trade,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 327,
    lpSymbol: 'DUSK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x678EDb8B268e73dB57b7694c163e1dc296b6e219',
    },
    token: tokens.dusk,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 326,
    lpSymbol: 'BIFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3f1A9f3D9aaD8bD339eD4853F345d2eF89fbfE0c',
    },
    token: tokens.bifi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 325,
    lpSymbol: 'TXL-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x1434BB50196A0C7eA825940b1DFd8aAd25d79817',
    },
    token: tokens.txl,
    quoteToken: tokens.busd,
  },
  {
    pid: 324,
    lpSymbol: 'COS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe98585bBb2dc81854fF100A3d9D7B0F53E0dafEd',
    },
    token: tokens.cos,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 323,
    lpSymbol: 'BUNNY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5aFEf8567414F29f0f927A0F2787b188624c10E2',
    },
    token: tokens.bunny,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 322,
    lpSymbol: 'ALICE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xcAD7019D6d84a3294b0494aEF02e73BD0f2572Eb',
    },
    token: tokens.alice,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 321,
    lpSymbol: 'FOR-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xE60B4e87645093A42fa9dcC5d0C8Df6E67f1f9d2',
    },
    token: tokens.for,
    quoteToken: tokens.busd,
  },
  {
    pid: 320,
    lpSymbol: 'BUX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x222C3CbB89647bF77822435Bd4c234A04272A77A',
    },
    token: tokens.bux,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 319,
    lpSymbol: 'NULS-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x853784B7BDe87d858555715c0123374242db7943',
    },
    token: tokens.nuls,
    quoteToken: tokens.busd,
  },
  {
    pid: 318,
    lpSymbol: 'BELT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xF3Bc6FC080ffCC30d93dF48BFA2aA14b869554bb',
    },
    token: tokens.belt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 316,
    lpSymbol: 'BFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x153Ad7d25B0b810497483d0cEE8AF42Fc533FeC8',
    },
    token: tokens.bfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 315,
    lpSymbol: 'DEXE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3578B1f9BCE98D2F4D293b422d8850fdf48B1f21',
    },
    token: tokens.dexe,
    quoteToken: tokens.busd,
  },
  {
    pid: 314,
    lpSymbol: 'BEL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x69DEE989c30b5fFe40867f5FC14F00E4bCE7B681',
    },
    token: tokens.bel,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 313,
    lpSymbol: 'TPT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x6D0c831254221ba121fB53fb44Df289A6558867d',
    },
    token: tokens.tpt,
    quoteToken: tokens.busd,
  },
  {
    pid: 312,
    lpSymbol: 'WATCH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x13321AcfF4A27f3d2bcA64b8bEaC6e5FdAAAf12C',
    },
    token: tokens.watch,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 309,
    lpSymbol: 'IOTX-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xc13aA76AAc067c86aE38028019F414D731b3D86A',
    },
    token: tokens.iotx,
    quoteToken: tokens.busd,
  },
  {
    pid: 308,
    lpSymbol: 'BOR-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe094c686aD6cDda57b9564457F541FBF099B948A',
    },
    token: tokens.bor,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 307,
    lpSymbol: 'bOPEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xc7A9c2af263ebB86139Cca9349e49b17129Ba033',
    },
    token: tokens.bopen,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 306,
    lpSymbol: 'SUSHI-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x16aFc4F2Ad82986bbE2a4525601F8199AB9c832D',
    },
    token: tokens.sushi,
    quoteToken: tokens.eth,
  },
  {
    pid: 305,
    lpSymbol: 'DODO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xA9986Fcbdb23c2E8B11AB40102990a08f8E58f06',
    },
    token: tokens.dodo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 303,
    lpSymbol: 'BRY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x21dD71aB78EDE3033c976948f769D506E4F489eE',
    },
    token: tokens.bry,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 302,
    lpSymbol: 'ZEE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8e799cB0737525CeB8A6C6Ad07f748535fF6377B',
    },
    token: tokens.zee,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 301,
    lpSymbol: 'SWGb-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x856f9AD94cA8680B899214Bb1EB3d235a3C33Afe',
    },
    token: tokens.swgb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 300,
    lpSymbol: 'COMP-ETH LP',
    lpAddresses: {
      97: '',
      56: '0x37908620dEf1491Dd591b5a2d16022A33cDDA415',
    },
    token: tokens.comp,
    quoteToken: tokens.eth,
  },
  {
    pid: 299,
    lpSymbol: 'SFP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x942b294e59a8c47a0F7F20DF105B082710F7C305',
    },
    token: tokens.sfp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 298,
    lpSymbol: 'LINA-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xC5768c5371568Cf1114cddD52CAeD163A42626Ed',
    },
    token: tokens.lina,
    quoteToken: tokens.busd,
  },
  {
    pid: 297,
    lpSymbol: 'LIT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1F37d4226d23d09044B8005c127C0517BD7e94fD',
    },
    token: tokens.lit,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 295,
    lpSymbol: 'BDO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x4288706624e3dD839b069216eB03B8B9819C10d2',
    },
    token: tokens.bdo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 294,
    lpSymbol: 'EGLD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xcD68856b6E72E99b5eEaAE7d41Bb4A3b484c700D',
    },
    token: tokens.egld,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 293,
    lpSymbol: 'UST-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x05faf555522Fa3F93959F86B41A3808666093210',
    },
    token: tokens.ust,
    quoteToken: tokens.busd,
  },
  {
    pid: 292,
    lpSymbol: 'mAMZN-UST LP',
    lpAddresses: {
      97: '',
      56: '0xC05654C66756eBB82c518598c5f1ea1a0199a563',
    },
    token: tokens.mamzn,
    quoteToken: tokens.ust,
  },
  {
    pid: 291,
    lpSymbol: 'mGOOGL-UST LP',
    lpAddresses: {
      97: '',
      56: '0xA3BfBbAd526C6B856B1Fdf73F99BCD894761fbf3',
    },
    token: tokens.mgoogl,
    quoteToken: tokens.ust,
  },
  {
    pid: 290,
    lpSymbol: 'mNFLX-UST LP',
    lpAddresses: {
      97: '',
      56: '0x91417426C3FEaA3Ca795921eB9FdD9715ad92537',
    },
    token: tokens.mnflx,
    quoteToken: tokens.ust,
  },
  {
    pid: 289,
    lpSymbol: 'mTSLA-UST LP',
    lpAddresses: {
      97: '',
      56: '0xEc6b56a736859AE8ea4bEdA16279Ecd8c60dA7EA',
    },
    token: tokens.mtsla,
    quoteToken: tokens.ust,
  },
  {
    pid: 288,
    lpSymbol: 'wSOTE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7653D2c31440f04d2c6520D482dC5DbD7650f70a',
    },
    token: tokens.wsote,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 287,
    lpSymbol: 'FRONT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xC6b668548aA4A56792e8002A920d3159728121D5',
    },
    token: tokens.front,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 286,
    lpSymbol: 'Helmet-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xC869A9943b702B03770B6A92d2b2d25cf3a3f571',
    },
    token: tokens.helmet,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 285,
    lpSymbol: 'BTCST-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xB2678C414ebC63c9CC6d1a0fC45f43E249B50fdE',
    },
    token: tokens.btcst,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 284,
    lpSymbol: 'LTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x71b01eBdDD797c8E9E0b003ea2f4FD207fBF46cC',
    },
    token: tokens.ltc,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 283,
    lpSymbol: 'USDC-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x2354ef4DF11afacb85a5C7f98B624072ECcddbB1',
    },
    token: tokens.usdc,
    quoteToken: tokens.busd,
  },
  {
    pid: 282,
    lpSymbol: 'DAI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x66FDB2eCCfB58cF098eaa419e5EfDe841368e489',
    },
    token: tokens.dai,
    quoteToken: tokens.busd,
  },
  {
    pid: 281,
    lpSymbol: 'BSCX-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x47C42b0A056A9C6e9C65b9Ef79020Af518e767A5',
    },
    token: tokens.bscx,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 280,
    lpSymbol: 'TEN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1B415C3ec8095AfBF9d78882b3a6263c4ad141B5',
    },
    token: tokens.ten,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 279,
    lpSymbol: 'bALBT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x24EB18bA412701f278B172ef96697c4622b19da6',
    },
    token: tokens.balbt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 278,
    lpSymbol: 'REEF-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd63b5CecB1f40d626307B92706Df357709D05827',
    },
    token: tokens.reef,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 277,
    lpSymbol: 'Ditto-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8645148dE4E339964bA480AE3478653b5bc6E211',
    },
    token: tokens.ditto,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 276,
    lpSymbol: 'VAI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x133ee93FE93320e1182923E1a640912eDE17C90C',
    },
    token: tokens.vai,
    quoteToken: tokens.busd,
  },
  {
    pid: 275,
    lpSymbol: 'BLK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x356Dd24BfF8e23BdE0430f00ad0C290E33438bD7',
    },
    token: tokens.blink,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 274,
    lpSymbol: 'UNFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x44EA47F2765fd5D26b7eF0222736AD6FD6f61950',
    },
    token: tokens.unfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 273,
    lpSymbol: 'HARD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x73566ca86248bD12F0979793e4671e99a40299A7',
    },
    token: tokens.hard,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 272,
    lpSymbol: 'CTK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x460b4193Ec4C1a17372Aa5FDcd44c520ba658646',
    },
    token: tokens.ctk,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 271,
    lpSymbol: 'SXP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD8E2F8b6Db204c405543953Ef6359912FE3A88d6',
    },
    token: tokens.sxp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 270,
    lpSymbol: 'INJ-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1BdCebcA3b93af70b58C41272AEa2231754B23ca',
    },
    token: tokens.inj,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 269,
    lpSymbol: 'FIL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xD9bCcbbbDFd9d67BEb5d2273102CE0762421D1e3',
    },
    token: tokens.fil,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 268,
    lpSymbol: 'UNI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x014608E87AF97a054C9a49f81E1473076D51d9a3',
    },
    token: tokens.uni,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 267,
    lpSymbol: 'YFI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xCE383277847f8217392eeA98C5a8B4a7D27811b0',
    },
    token: tokens.yfi,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 266,
    lpSymbol: 'ATOM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x468b2DC8DC75990eE3E9dc0648965Ad6294E7914',
    },
    token: tokens.atom,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 265,
    lpSymbol: 'XRP-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x03F18135c44C64ebFdCBad8297fe5bDafdBbdd86',
    },
    token: tokens.xrp,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 264,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE',
    },
    token: tokens.usdt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 263,
    lpSymbol: 'ALPHA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xACF47CBEaab5c8A6Ee99263cfE43995f89fB3206',
    },
    token: tokens.alpha,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 262,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
    },
    token: tokens.btcb,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 261,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc',
    },
    token: tokens.eth,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 260,
    lpSymbol: 'XVS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7EB5D86FD78f3852a3e0e064f2842d45a3dB6EA2',
    },
    token: tokens.xvs,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 259,
    lpSymbol: 'TWT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x3DcB1787a95D2ea0Eb7d00887704EeBF0D79bb13',
    },
    token: tokens.twt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 258,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
    },
    token: tokens.usdt,
    quoteToken: tokens.busd,
  },
  {
    pid: 257,
    lpSymbol: 'LINK-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x824eb9faDFb377394430d2744fa7C42916DE3eCe',
    },
    token: tokens.link,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 256,
    lpSymbol: 'EOS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xB6e34b5C65Eda51bb1BD4ea5F79d385Fb94b9504',
    },
    token: tokens.eos,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 255,
    lpSymbol: 'DOT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xDd5bAd8f8b360d76d12FdA230F8BAF42fe0022CF',
    },
    token: tokens.dot,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 254,
    lpSymbol: 'BAND-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x168B273278F3A8d302De5E879aA30690B7E6c28f',
    },
    token: tokens.band,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 253,
    lpSymbol: 'ADA-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x28415ff2C35b65B9E5c7de82126b4015ab9d031F',
    },
    token: tokens.ada,
    quoteToken: tokens.wbnb,
  },
  /**
   * V2 farms, set to be removed once unstaked
   */
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
