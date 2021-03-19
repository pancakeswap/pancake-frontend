import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon } from '@pancakeswap-libs/uikit'
import useTheme from '../hooks/useTheme'

const CoreTag = (props) => {
  const { isDark } = useTheme()
  return (
    <Tag variant="secondary" outline={!isDark} startIcon={<VerifiedIcon />} {...props}>
      Core
    </Tag>
  )
}

const CommunityTag = (props) => {
  const { isDark } = useTheme()
  return (
    <Tag variant="textSubtle" outline={!isDark} startIcon={<CommunityIcon />} {...props}>
      Community
    </Tag>
  )
}

const BinanceTag = (props) => {
  const { isDark } = useTheme()
  return (
    <Tag variant="binance" outline={!isDark} startIcon={<BinanceIcon />} {...props}>
      Binance
    </Tag>
  )
}

const DualTag = (props) => {
  const { isDark } = useTheme()
  return (
    <Tag variant="textSubtle" outline={!isDark} {...props}>
      Dual
    </Tag>
  )
}

export { CoreTag, CommunityTag, BinanceTag, DualTag }
