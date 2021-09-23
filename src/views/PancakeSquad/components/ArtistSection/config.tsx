import React from 'react'
import { InstagramIcon, TwitterIcon } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

type ArtistConfigType = {
  t: ContextApi['t']
}

const artistConfigBuilder = ({ t }: ArtistConfigType) => ({
  headingText: t('Meet the Artist'),
  bodyText: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
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
  image: { src: '/images/pancakeSquad/artist.png', alt: 'Chef Cecy bio' },
})

export default artistConfigBuilder
