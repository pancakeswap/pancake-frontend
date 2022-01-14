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
    t('The birthplace of Cecy is truly unknown'),
    t('But legend tells us, she was sailing alone'),
    t('Beyond the mountains, across the sea'),
    t('When she found an island, said “this is for me!”'),
    t('‘Twas full of rabbits, who caught her attention'),
    t('Making neat stuff beyond her comprehension'),
    t('The bunnies were working in a big ol’ kitchen'),
    t('Cooking hot pancakes for their big ol’ mission:'),
    t('To drizzle in syrup and hand them out soon'),
    t('So that bunnies worldwide may fly to the moon.'),
  ],
  buttons: [
    {
      to: 'https://twitter.com/cecymeade',
      text: t('Follow on Twitter'),
      external: true,
      icon: <TwitterIcon color="white" />,
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
