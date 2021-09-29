import React from 'react'
import { InstagramIcon, TwitterIcon } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

type ArtistConfigType = {
  t: ContextApi['t']
  isDark: boolean
}

const artistConfigBuilder = ({ t, isDark }: ArtistConfigType) => ({
  headingText: t('Meet the Artist'),
  bodyText: [
    'Cecy´s birth place is definitely unknown',
    'But legend said she was sailing all alone',
    'Through the mountains and across the sea',
    'She found an island in which to live',
    'Was full of rabbitts!! that caught her attention ',
    'making stuff beyond her comprehension',
    'The bunnies were working on a kitchen ',
    'baking pancakes with one Big mission ',
    'To send sweet bread very soon',
    'so they all together can reach the moon.',
  ],
  buttons: [
    {
      to: 'https://twitter.com/cecymeade',
      text: t('Follow on Twitter'),
      external: true,
      icon: <TwitterIcon fillColor="white" />,
    },
    {
      to: 'https://www.instagram.com/cecymeade/',
      text: t('Follow on Instagram'),
      external: true,
      icon: <InstagramIcon color="white" />,
    },
  ],
  image: { src: `/images/pancakeSquad/artist${isDark ? '-dark' : ''}.png`, alt: 'Chef Cecy bio' },
})

export default artistConfigBuilder
