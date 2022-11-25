import { Text, Link } from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'

type FAQsType = {
  t: ContextApi['t']
}

const config = ({ t }: FAQsType) => [
  {
    title: t('Is the Swap audited?'),
    description: [
      t(
        'The Swap uses the Uniswap V2 smart contracts which makes it inherit all security and audits from it. This basically means you have the security of Uniswap on all our supported chains.',
      ),
    ],
  },
  {
    title: t('How is the Bridge secured?'),
    description: [
      t(
        'The IceCream bridge builds on top of a industry standard and commonly used bridge architecture. In addition we are currently implementing a second layer of security on top of this bridge architecture. Basically these two layers will validate each other and therefore might create the most secure Bridge currently in the Crypto space. To our knowledge no other Bridge uses a completely seperated second layer of security.',
      ),
    ],
  },
  {
    title: t('How much reward will I get for providing liquidity?'),
    description: [
      t(
        'Many AirDrops and 5/6 of the trading fees will be distributed across all liquidity providers. The AirDrops started with 5% weekly, which is over 1200% APY. The amount of AirDrops slowly decreases over time, so be fast!',
      ),
    ],
  },
  {
    title: t('Which Chains are supported?'),
    description: [
      t('The address for the IceCream token on Bitgert is: 0xB999Ea90607a826A3E6E6646B404c3C7d11fa39D'),
      <Text as="p" color="textSubtle" fontSize="16px">
        A up to date list of all IceCream addresses for all supported chains can be found at our{' '}
        <Link
          display="inline-flex"
          color="text"
          title="IceCreamSwap Wiki"
          href="https://wiki.icecreamswap.com/introduction/ice"
        >
          Wiki
        </Link>
        .
      </Text>,
    ],
  },
  {
    title: t('Airdrops?'),
    description: [
      t('Yes!'),
      t(
        'An Airdrop is an great way to reward liquidity providers, especially early ones, and distribute the token fairly. Currently we have weekly AirDrops for liquidity providers.',
      ),
    ],
  },
  {
    title: t('Where can i verify the used contracts of the Swap?'),
    description: [
      t('Everyone can see the verified Smart Contracts on https://brisescan.com, addresses are:'),
      t('Factory: 0x9E6d21E759A7A288b80eef94E4737D313D31c13f'),
      t('Router02: 0xBb5e1777A331ED93E07cF043363e48d320eb96c4'),
      t('As you can verify yourself, the Contracts are the original UniswapV2 Contracts.'),
    ],
  },
]
export default config
