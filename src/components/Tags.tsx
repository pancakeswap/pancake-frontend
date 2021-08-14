import React from 'react'
import {
  Tag,
  VerifiedIcon,
  CommunityIcon,
  BinanceIcon,
  RefreshIcon,
  AutoRenewIcon,
  ErrorIcon,
} from '@rug-zombie-libs/uikit'

const CoreTag = (props) => (
  <Tag variant="secondary" outline startIcon={<VerifiedIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Core
  </Tag>
)

const CommunityTag = (props) => (
  <Tag variant="textSubtle" outline startIcon={<CommunityIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Community
  </Tag>
)

const BinanceTag = (props) => (
  <Tag variant="binance" outline startIcon={<BinanceIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Binance
  </Tag>
)

const DualTag = (props) => (
  <Tag variant="textSubtle" outline {...props}>
    Dual
  </Tag>
)

const ManualPoolTag = (props) => (
  <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Manual
  </Tag>
)

const CompoundingPoolTag = (props) => (
  <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
    Auto
  </Tag>
)

const UnlockedTag = (props) => (
  <Tag variant="secondary" outline startIcon={<VerifiedIcon width="18px" color="secondary" mr="4px" />} {...props}>
    Unlocked
  </Tag>
)

const EndedTag = (props) => (
  <Tag variant="secondary" outline startIcon={<ErrorIcon width="18px" color="success" mr="4px" />} {...props}>
    Ended
  </Tag>
)

const OngoingTag = (props) => (
  <Tag variant="primary" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
    Ongoing
  </Tag>
)

export { CoreTag, CommunityTag, BinanceTag, DualTag, ManualPoolTag, CompoundingPoolTag, OngoingTag, EndedTag, UnlockedTag }
