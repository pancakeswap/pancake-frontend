import { Trans } from '@pancakeswap/localization'
import { Box, Link } from '@pancakeswap/uikit'

export const BnbSnbnbFaq = () => [
  {
    id: 1,
    title: <Trans>How does SnBNB generate staking rewards?</Trans>,
    description: (
      <>
        <Trans>
          Similar to ETH liquid staking, staking rewards are received for delegating BNB to SnBNB’s synclub validator.
          The validator will take its cut from rewards before sharing it to the protocol as claimable tokens. The
          rewards earned are then split into two parts:
        </Trans>
        <Box mt="4px" ml="8px">
          <Box>
            -{' '}
            <Trans>
              95% goes to SnBNB holders in the form of SnBNB value appreciation: SnBNB holders’ share of the BNB pool
              keeps increasing due to the increase in the SnBNB/BNB exchange rate.
            </Trans>
          </Box>
          <Box mt="4px">
            - <Trans>5% goes to Synclub/Helio</Trans>
          </Box>
        </Box>
      </>
    ),
  },
  {
    id: 2,
    title: <Trans>How is the APR calculated for SnBNB?</Trans>,
    description: (
      <>
        <Trans>
          The APR for SnBNB varies between 0.5%-3%. The APR earned by validators on BNB Chain depends on two factors:
        </Trans>
        <Box mt="4px" ml="8px">
          <Box>
            - <Trans>Commission Rate: synclub validator charges 10% commission fee.</Trans>
          </Box>
          <Box mt="4px">
            - <Trans>Voting Power: The staked amount for a validator determines the APR it receives.</Trans>
          </Box>
        </Box>
        <Box mt="10px">
          <Trans>
            The Synclub validator employs MEV (Miner Extractable Value) to enhance its APR.SnBNB appreciates against BNB
            in line with BNB’s staking APR.
          </Trans>
        </Box>
      </>
    ),
  },
  {
    id: 3,
    title: <Trans>How can I use SnBNB?</Trans>,
    description: (
      <>
        <Trans>
          You can use SnBNB to explore other use cases such as swapping, lending/borrowing and yield farming on
          BnbChain. Alongside
        </Trans>
        <Link m="0 4px" external style={{ display: 'inline' }} href="https://helio.money/">
          Helio
        </Link>
        <Trans>
          PancakeSwap will be supporting new liquid staking strategies for users to maximise utility and yield on
          BnbChain
        </Trans>
      </>
    ),
  },
  {
    id: 4,
    // eslint-disable-next-line react/no-unescaped-entities
    title: <Trans>Do I need to claim staking rewards if I'm using SnBNB?</Trans>,
    description: (
      <Trans>
        No. Staking rewards accrue in the SnBNB token. This means that the SnBNB token will increase in value over BNB.
      </Trans>
    ),
  },
  {
    id: 5,
    title: <Trans>How do I convert SnBNB back to BNB?</Trans>,
    description: (
      <>
        <Trans>Please visit</Trans>
        <Link m="0 4px" external style={{ display: 'inline' }} href="https://lista.org/liquid-staking/BNB">
          https://lista.org/liquid-staking/BNB
        </Link>
        <Trans>
          to unstake your SnBNB. PancakeSwap is working to support a conversion contract on our liquid staking page to
          convert SnBNB back to BNB seamlessly.
        </Trans>
      </>
    ),
  },
]
