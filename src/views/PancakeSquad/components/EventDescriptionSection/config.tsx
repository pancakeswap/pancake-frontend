import React from 'react'
import { Text } from '@tovaswapui/uikit'
import { ContextApi } from 'contexts/Localization/types'
import Link from 'next/link'

type EventDescriptionType = {
  t: ContextApi['t']
}

const eventDescriptionConfigBuilder = ({ t }: EventDescriptionType) => ({
  headingText: t('Fair, Random, Rare'),
  subHeadingText: t(
    'All Pancake Squad NFTs are allocated to Squad Ticket holders through a provably-fair system based on ChainLink at the time of minting.',
  ),
  bodyTextHeader: t('Out of the 10,000 total NFTs in the squad,'),
  bodyText: [
    {
      id: 1,
      content: (
        <>{t('490 are available in the pre-sale for owners of Gen 0 Pancake Bunnies (bunnyID 0, 1, 2, 3, 4)')}</>
      ),
    },
    { id: 2, content: t('120 are reserved by the team for community giveaways, etc;') },
    {
      id: 3,
      content: (
        <>
          {t('and the remaining NFTs can be minted by anyone with a ')}
          <Link href="/profile">
            <Text as="a" display="inline-block" color="primary" bold>
              {t('Pancake Profile!')}
            </Text>
          </Link>
        </>
      ),
    },
  ],
  primaryButton: {
    to: 'https://docs.pancakeswap.finance/',
    text: t('View Documentation'),
    external: true,
    isDisplayed: false,
  },
  image: { src: '/images/pancakeSquad/moonBunny/body.png', alt: 'moon bunny' },
  accessoriesImages: [
    { src: '/images/pancakeSquad/moonBunny/band.png', alt: 'headband' },
    { src: '/images/pancakeSquad/moonBunny/cloth.png', alt: 'cloth' },
    { src: '/images/pancakeSquad/moonBunny/glasses.png', alt: 'glasses' },
    { src: '/images/pancakeSquad/moonBunny/pancake.png', alt: 'pancake' },
  ],
})

export default eventDescriptionConfigBuilder
