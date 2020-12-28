import { Ifo } from './types'

const ifos: Ifo[] = [
  {
    id: 'blink',
    address: '0x44a9Cc8463EC00937242b660BF65B10365d99baD',
    isActive: false,
    name: 'BLINk (BLK)',
    subTitle: 'Online games on BSC',
    description:
      'BLINk enables BNB holders to enjoy gaming experiences that WINk users on Tron have been enjoying for over two years.',
    launchDate: 'Nov. 20',
    launchTime: '9PM SGT',
    saleAmount: '100,000,000 BLINK',
    raiseAmount: '$1,000,000',
    cakeToBurn: '$500,000',
    projectSiteUrl: 'https://blink.wink.org',
    currency: 'CAKE-BNB LP',
    currencyAddress: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
    tokenDecimals: 6,
    releaseBlockNumber: 3279767,
  },
  {
    id: 'ditto',
    address: '0x570c9eB19553526Fb35895a531928E19C7D20788',
    isActive: false,
    name: 'Ditto (DITTO)',
    subTitle: 'Next-gen elastic supply token',
    description:
      'Ditto is the first elastic supply token on the Binance Smart Chain. Its goal is to maintain a stable price of $1, where its supply will adapt to changes in demand. All supply changes will apply equally to every wallet holding Ditto, and holders should always have the same % of the total supply',
    launchDate: 'Dec. 23',
    launchTime: '3PM SGT',
    saleAmount: '700,000 DITTO',
    raiseAmount: '$630,000',
    cakeToBurn: '$315,000',
    projectSiteUrl: 'https://ditto.money/',
    currency: 'CAKE-BNB LP',
    currencyAddress: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
    tokenDecimals: 9,
    releaseBlockNumber: 3279767,
  },
  {
    id: 'tenet',
    address: '0xB922aA19A2603A07C6C9ED6c236618C9bac51f06',
    isActive: true,
    name: 'Tenet (TEN)',
    subTitle: 'Cross-chain Automated Market Maker',
    description:
      'Tenet is a cross-chain Automated Market Maker (AMM) connector that provides a decentralized Liquidity Tap for various tokens. The Liquidity Tap is the powerhouse of the Liquidity Pool, employing a dynamic algorithm to give the Liquidity Provider fairer, more efficient, and richer incentives. Tenet aims to build a cross-chain and cross-platform toolkit protocol that allows the demand side to customize the parameters of the liquidity tap, allowing them to reach out to more liquidity participants effectively and with relative ease.',
    launchDate: 'Jan. 5',
    launchTime: '3PM SGT',
    saleAmount: '1,000,000 TEN',
    raiseAmount: '$1,000,000',
    cakeToBurn: '$500,000',
    projectSiteUrl: 'https://www.tenet.farm/',
    currency: 'CAKE-BNB LP',
    currencyAddress: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
    tokenDecimals: 18,
    releaseBlockNumber: 3483883,
  },
]

export default ifos
