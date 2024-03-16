import { Trans } from '@pancakeswap/localization'
import { HooksType, TagType, TagValue } from './types'

export const HooksConfig: HooksType[] = [
  {
    title: <Trans>Full Range</Trans>,
    desc: (
      <Trans>
        The Full Range Hook allows users to add liquidity across the entire price range within concentrated liquidity
        pools, similar to v2 pools. This hook eases liquidity position management for the LPs.
      </Trans>
    ),
    tags: [TagType.MISCELLANEOUS, TagType.CLAMM, TagType.LPs],
    tagsValue: [TagValue.MISCELLANEOUS, TagValue.CLAMM, TagValue.LPs],
    createDate: '15/03/2024',
    githubLink: 'https://github.com/pancakeswap/pancake-v4-hooks/tree/main/src/pool-cl/full-range',
  },
  {
    title: <Trans>Geomean Oracle</Trans>,
    desc: (
      <Trans>
        The Geomean Oracle hook computes time-weighted average price from a set of pool price observations, using
        geometric mean rather than arithmetic mean. This approach makes it more resilient to temporary price spikes.
      </Trans>
    ),
    tags: [TagType.ORACLE, TagType.CLAMM],
    tagsValue: [TagValue.ORACLE, TagValue.CLAMM],
    createDate: '15/03/2024',
    githubLink: 'https://github.com/pancakeswap/pancake-v4-hooks/tree/main/src/pool-cl/geomean-oracle',
  },
  {
    title: <Trans>Limit Order</Trans>,
    desc: (
      <Trans>
        The Limit Order hook facilitates on-chain limit order functionality for liquidity pools, eliminating the need
        for off-chain keepers to process orders. Offering a user experience akin to centralized exchanges, traders can
        specify buy or sell prices for assets. Orders are executed automatically when the pool price meets the specified
        limit price.
      </Trans>
    ),
    tags: [TagType.ORDER_TYPES, TagType.CLAMM, TagType.TRADERS],
    tagsValue: [TagValue.ORDER_TYPES, TagValue.CLAMM, TagValue.TRADERS],
    createDate: '15/03/2024',
    githubLink: 'https://github.com/pancakeswap/pancake-v4-hooks/tree/main/src/pool-cl/limit-order',
  },
  {
    title: <Trans>Geomean Oracle</Trans>,
    desc: (
      <Trans>
        The Geomean Oracle hook computes time-weighted average price from a set of pool price observations, using
        geometric mean rather than arithmetic mean. This approach makes it more resilient to temporary price spikes.
      </Trans>
    ),
    tags: [TagType.ORACLE, TagType.LBAMM],
    tagsValue: [TagValue.ORACLE, TagValue.LBAMM],
    createDate: '15/03/2024',
    githubLink: 'https://github.com/pancakeswap/pancake-v4-hooks/tree/main/src/pool-bin/geomean-oracle',
  },
  {
    title: <Trans>Limit Order</Trans>,
    desc: (
      <Trans>
        The Limit Order hook facilitates on-chain limit order functionality for liquidity pools, eliminating the need
        for off-chain keepers to process orders. Offering a user experience akin to centralized exchanges, traders can
        specify buy or sell prices for assets. Orders are executed automatically when the pool price meets the specified
        limit price.
      </Trans>
    ),
    tags: [TagType.ORDER_TYPES, TagType.LBAMM, TagType.TRADERS],
    tagsValue: [TagValue.ORDER_TYPES, TagValue.LBAMM, TagValue.TRADERS],
    createDate: '15/03/2024',
    githubLink: 'https://github.com/pancakeswap/pancake-v4-hooks/tree/main/src/pool-bin/limit-order',
  },
]
