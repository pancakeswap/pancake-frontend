import { Flex } from '@pancakeswap/uikit'
import React from 'react'
import BannerImage from './BannerImage'

const Header = () => {
  return (
    <Flex flexDirection="column">
      <BannerImage src="/images/teams/cakers-banner.png" />
    </Flex>
  )
}

export default Header
