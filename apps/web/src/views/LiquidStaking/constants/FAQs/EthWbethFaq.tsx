import { Trans } from '@pancakeswap/localization'
import { Link, LinkExternal } from '@pancakeswap/uikit'

export const EthWbethFaq = () => [
  {
    title: <Trans>How does WBETH generate staking rewards?</Trans>,
    description: (
      <Trans>
        Liquid Staking Derivatives generate staking rewards through the Ethereum network. When you stake ETH via
        Binance, you will get BETH as the reward for staking your ETH. WBETH is the 1:1 wrapped version of BETH that can
        be used on-chain.
      </Trans>
    ),
  },
  {
    title: <Trans>What staking APR can I get from liquid staking?</Trans>,
    description: (
      <>
        <Trans>
          Post-merge, the APR is hovering at around 3-5% for Ethereum validators. For WBETH, the daily APR is published
          by the Binance Earn team
        </Trans>
        <LinkExternal style={{ display: 'inline-flex' }} href="https://www.binance.com/en/eth2">
          <Trans>here.</Trans>
        </LinkExternal>
      </>
    ),
  },
  {
    title: <Trans>What is the difference between WBETH and BETH?</Trans>,
    description: (
      <>
        <Trans>
          WBETH is the wrapped version of BETH. Unlike BETH, WBETH can be obtained and utilized on-chain. For a
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
    title: <Trans>How can I use WBETH?</Trans>,
    description: (
      <Trans>
        While accruing ETH staking rewards, you can use WBETH to explore other DeFi use cases including swapping,
        lending/borrowing, yield farming, collateralization and more. Stay tuned for more announcements and content on
        WBETH utility.
      </Trans>
    ),
  },
  {
    // eslint-disable-next-line react/no-unescaped-entities
    title: <Trans>Do I need to claim staking rewards if I'm using WBETH?</Trans>,
    description: (
      <Trans>
        No. Staking rewards accrue in the WBETH token. This means that the WBETH token will increase in value over ETH.
      </Trans>
    ),
  },
  {
    title: <Trans>How do I convert WBETH back to ETH?</Trans>,
    description: (
      <>
        <Trans>You can convert WBETH to ETH through</Trans>
        <Link m="0 4px" style={{ display: 'inline' }} href="/swap">
          <Trans>our swap page</Trans>.
        </Link>
        <Trans>
          PancakeSwap is also working to support a conversion contract on our liquid staking page to convert WBETH back
          to ETH seamlessly.
        </Trans>
      </>
    ),
  },
]
