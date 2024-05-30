import { Trans } from '@pancakeswap/localization'
import { LinkExternal, StyledLink } from '@pancakeswap/uikit'
import NextLink from 'next/link'

export const EthWbethFaq = () => [
  {
    id: 1,
    title: <Trans>How does wBETH generate staking rewards?</Trans>,
    description: (
      <Trans>
        Liquid Staking Derivatives generate staking rewards through the Ethereum network. When you stake ETH via
        Binance, you will get BETH as the reward for staking your ETH. wBETH is the 1:1 wrapped version of BETH that can
        be used on-chain.
      </Trans>
    ),
  },
  {
    id: 2,
    title: <Trans>What staking APR can I get from liquid staking?</Trans>,
    description: (
      <>
        <Trans>
          Post-merge, the APR is hovering at around 3-5% for Ethereum validators. For wBETH, the daily APR is published
          by the Binance Earn team
        </Trans>
        <LinkExternal ml="4px" style={{ display: 'inline-flex' }} href="https://www.binance.com/en/eth2">
          <Trans>here.</Trans>
        </LinkExternal>
      </>
    ),
  },
  {
    id: 3,
    title: <Trans>What is the difference between wBETH and BETH?</Trans>,
    description: (
      <>
        <Trans>
          wBETH is the wrapped version of BETH. Unlike BETH, wBETH can be obtained and utilized on-chain. For a
          side-by-side comparison,
        </Trans>{' '}
        <LinkExternal
          style={{ display: 'inline-flex' }}
          href="https://www.binance.com/en/support/announcement/binance-introduces-wrapped-beacon-eth-wbeth-on-eth-staking-a1197f34d832445db41654ad01f56b4d"
        >
          <Trans>visit this page.</Trans>
        </LinkExternal>
      </>
    ),
  },
  {
    id: 4,
    title: <Trans>How can I use wBETH?</Trans>,
    description: (
      <Trans>
        While accruing ETH staking rewards, you can use wBETH to explore other DeFi use cases including swapping,
        lending/borrowing, yield farming, collateralization and more. Stay tuned for more announcements and content on
        wBETH utility.
      </Trans>
    ),
  },
  {
    id: 5,
    // eslint-disable-next-line react/no-unescaped-entities
    title: <Trans>Do I need to claim staking rewards if I'm using wBETH?</Trans>,
    description: (
      <Trans>
        No. Staking rewards accrue in the wBETH token. This means that the wBETH token will increase in value over ETH.
      </Trans>
    ),
  },
  {
    id: 6,
    title: <Trans>How do I convert wBETH back to ETH?</Trans>,
    description: (
      <>
        <Trans>You can convert wBETH to ETH through</Trans>
        <NextLink href="/swap">
          <StyledLink color="primary" m="0 4px" style={{ display: 'inline' }}>
            <Trans>our swap page</Trans>.
          </StyledLink>
        </NextLink>
        <Trans>
          PancakeSwap is also working to support a conversion contract on our liquid staking page to convert wBETH back
          to ETH seamlessly.
        </Trans>
      </>
    ),
  },
]
