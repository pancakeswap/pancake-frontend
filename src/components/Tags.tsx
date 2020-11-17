import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon } from '@pancakeswap-libs/uikit'

const CoreTag = () => (
  <Tag variant="purple" outline startIcon={<VerifiedIcon />}>
    Core
  </Tag>
)

const CommunityTag = () => (
  <Tag variant="pink" outline startIcon={<CommunityIcon />}>
    Community
  </Tag>
)

export { CoreTag, CommunityTag }
