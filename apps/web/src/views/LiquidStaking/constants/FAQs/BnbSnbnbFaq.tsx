import { Trans } from '@pancakeswap/localization'
import { Box, Link } from '@pancakeswap/uikit'

export const BnbSnbnbFaq = () => [
  {
    title: <Trans>How does snBNB generate staking rewards?</Trans>,
    description: (
      <>
        <Trans>
          Similar to ETH liquid staking, staking rewards are received for delegating BNB to snBNB’s synclub validator.
          The validator will take its cut from rewards before sharing it to the protocol as claimable tokens. The
          rewards earned are then split into two parts:
        </Trans>
        <Box mt="4px" ml="8px">
          <Box>
            -{' '}
            <Trans>
              95% goes to snBNB holders in the form of snBNB value appreciation: snBNB holders’ share of the BNB pool
              keeps increasing due to the increase in the snBNB/BNB exchange rate.
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
    title: <Trans>How is the APR calculated for snBNB?</Trans>,
    description: (
      <>
        <Trans>
          The APR for snBNB varies between 0.5%-3%. The APR earned by validators on BNB Chain depends on two factors:
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
            The Synclub validator employs MEV (Miner Extractable Value) to enhance its APR.snBNB appreciates against BNB
            in line with BNB’s staking APR.
          </Trans>
        </Box>
      </>
    ),
  },
  {
    title: <Trans>How can I use snBNB?</Trans>,
    description: (
      <>
        <Trans>
          You can use snBNB to explore other use cases such as swapping, lending/borrowing and yield farming on
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
    // eslint-disable-next-line react/no-unescaped-entities
    title: <Trans>Do I need to claim staking rewards if I'm using snBNB?</Trans>,
    description: (
      <Trans>
        No. Staking rewards accrue in the snBNB token. This means that the snBNB token will increase in value over BNB.
      </Trans>
    ),
  },
  {
    title: <Trans>How do I convert snBNB back to BNB?</Trans>,
    description: (
      <>
        <Trans>Please visit</Trans>
        <Link m="0 4px" external style={{ display: 'inline' }} href="https://www.synclub.io/en/liquid-staking/BNB">
          https://www.synclub.io/en/liquid-staking/BNB
        </Link>
        <Trans>
          to unstake your snBNB. PancakeSwap is working to support a conversion contract on our liquid staking page to
          convert snBNB back to BNB seamlessly.
        </Trans>
      </>
    ),
  },
]
