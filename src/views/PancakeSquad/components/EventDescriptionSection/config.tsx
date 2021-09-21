import React from 'react'
import { Text } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

type EventDescriptionType = {
  t: ContextApi['t']
}

const eventDescriptionConfigBuilder = ({ t }: EventDescriptionType) => ({
  headingText: t('Fair, Random, Rare'),
  subHeadingText: t(
    'All Pancake Squad NFTs are allocated to Minting Ticket holders through a provably-fair system based on ChainLink at the time of minting.',
  ),
  bodyTextHeader: t('Out of the 10,000 total NFTs in the squad,'),
  bodyText: [
    {
      id: 1,
      content: (
        <>
          {t('490 are available in the pre-sale for owners of ')}
          <Text display="inline-block" color="primary" bold>
            {t('Gen 0 Pancake Bunnies')}
          </Text>
        </>
      ),
    },
    { id: 2, content: t('100 are reserved by the team for community giveaways;') },
    {
      id: 3,
      content: (
        <>
          {t('and the remaining NFTs can be minted by anyone with a ')}
          <Text display="inline-block" color="primary" bold>
            {t('Pancake Profile!')}
          </Text>
        </>
      ),
    },
  ],
  primaryButton: {
    to: 'https://docs.pancakeswap.finance/',
    text: 'View Documentation',
    external: true,
  },
  image: { src: '/images/pancakeSquad/moonBunny.png', alt: 'moon bunny' },
})

export default eventDescriptionConfigBuilder
