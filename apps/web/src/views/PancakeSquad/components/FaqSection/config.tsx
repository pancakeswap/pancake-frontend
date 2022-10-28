import { Text } from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'

type FAQsType = {
  t: ContextApi['t']
}

const config = ({ t }: FAQsType) => [
  {
    title: t('What’s the Smart Contract?'),
    description: [
      <Text key={1} color="textSubtle">
        {t('The smart contract address will be released soon before the sale starts.')}
      </Text>,
    ],
  },
  {
    title: t('I can’t see my NFT’s picture!'),
    description: [
      t(
        'Wait for the reveal! After all 10,000 members of the Pancake Squad have been minted, their images will remain hidden for a few days. Just be patient :)',
      ),
    ],
  },
  {
    title: t('How many can I mint?'),
    description: [
      t('The max limit per wallet is 10 NFTs.'),
      t(
        'Users holding Gen 0 Pancake Bunny NFTs at the snapshot may also purchase one additional Pancake Squad NFT in the presale for each Pancake Bunny they hold.',
      ),
      t(
        'For example, if you have 5 Gen 0 bunnies, you can buy 5 minting tickets in the presale, then max. 10 in the public sale.',
      ),
    ],
  },
  {
    title: t('Where do the fees go?'),
    description: [t('100% of CAKE spent on Pancake Squad NFTs will be burned as part of our weekly CAKE burn.')],
  },
  {
    title: t('How are the NFTs randomly distributed?'),
    description: [
      t(
        'Once all 10,000 Squad Tickets have been bought, Chainlink VRF will be used to randomly allocate the pre-generated NFTs to the purchased Tickets. Squad Tickets are allocated IDs numbered in order of their purchase.',
      ),
      t(
        'Once all 10,000 have been sold, VRF will pick numbers from 0 to 9999, which will be used to shift the Squad Ticket ID. This will ensure that the distribution of rare NFTs will be randomized, and prevents “sniping” of specific NFTs during the pre-sale or public sale phases.',
      ),
    ],
  },
  {
    title: t('What’s the value of each NFT?'),
    description: [
      t(
        'Value is subjective, but since different traits have different levels of rarity, you can expect bunnies with rarer traits to trade for higher prices than others. If you’re planning to sell, check the NFT market for the price of bunnies with a similarly rare traits to yours.',
      ),
    ],
  },
]
export default config
