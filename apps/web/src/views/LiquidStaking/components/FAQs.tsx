import { useTranslation } from '@pancakeswap/localization'
import { Card, CardHeader, Heading, CardBody, Text, Link, LinkExternal } from '@pancakeswap/uikit'

import FoldableText from 'components/FoldableSection/FoldableText'

const config = (t) => [
  {
    title: t('How does WBETH generate staking rewards?'),
    description: t(
      'Liquid Staking Derivatives generate staking rewards through the Ethereum network. When you stake ETH via Binance, you will get BETH as the reward for staking your ETH. WBETH is the 1:1 wrapped version of BETH that can be used on-chain.',
    ),
  },
  {
    title: t('What staking APR can I get from liquid staking?'),
    description: (
      <>
        {t(
          'Post-merge, the APR is hovering at around 3-5% for Ethereum validators. For WBETH, the daily APR is published by the Binance Earn team',
        )}{' '}
        <LinkExternal style={{ display: 'inline-flex' }} href="https://www.binance.com/en/eth2">
          {t('here.')}
        </LinkExternal>
      </>
    ),
  },
  {
    title: t('What is the difference between WBETH and BETH?'),
    description: (
      <>
        {t(
          'WBETH is the wrapped version of BETH. Unlike BETH, WBETH can be obtained and utilized on-chain. For a side-by-side comparison,',
        )}{' '}
        <LinkExternal
          style={{ display: 'inline-flex' }}
          href="https://www.binance.com/en/support/announcement/binance-introduces-wrapped-beacon-eth-wbeth-on-eth-staking-a1197f34d832445db41654ad01f56b4d"
        >
          {t('visit this page.')}
        </LinkExternal>
      </>
    ),
  },
  {
    title: t('How can I use WBETH?'),
    description: t(
      'While accruing ETH staking rewards, you can use WBETH to explore other DeFi use cases including swapping, lending/borrowing, yield farming, collateralization and more. Stay tuned for more announcements and content on WBETH utility.',
    ),
  },
  {
    title: t("Do I need to claim staking rewards if I'm using WBETH?"),
    description: t(
      'No. Staking rewards accrue in the WBETH token. This means that the WBETH token will increase in value over ETH.',
    ),
  },
  {
    title: t('How do I convert WBETH back to ETH?'),
    description: (
      <>
        {t('You can convert WBETH to ETH through ')}
        <Link style={{ display: 'inline' }} href="/swap">
          {t('our swap page')}.{' '}
        </Link>
        {t(
          'PancakeSwap is also working to support a conversion contract on our liquid staking page to convert WBETH back to ETH seamlessly.',
        )}
      </>
    ),
  },
]

export const LiquidStakingFAQs = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <Heading color="secondary" scale="lg">
          {t('FAQ')}
        </Heading>
      </CardHeader>
      <CardBody>
        {config(t).map(({ title, description }, i, { length }) => (
          <FoldableText key={title} id={title} mb={i + 1 === length ? '' : '24px'} title={title}>
            <Text color="textSubtle" as="p">
              {description}
            </Text>
          </FoldableText>
        ))}
      </CardBody>
    </Card>
  )
}
