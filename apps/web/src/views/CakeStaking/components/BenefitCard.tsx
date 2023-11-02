import { useTranslation } from '@pancakeswap/localization'
import { Button, Card, Flex, FlexGap, Heading, NextLinkFromReactRouter, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

type BenefitCardType = 'earnCake' | 'gaugesVoting' | 'farmBoost' | 'snapshotVoting' | 'ifo' | 'more'

type BenefitItem = {
  headImg: string
  title: string
  subTitle?: string
  desc: string[]
  btnText?: string
  link?: string
}

const BENEFITS: Record<BenefitCardType, BenefitItem> = {
  earnCake: {
    headImg: '/images/cake-staking/benefit-earn-cake.png',
    title: 'Earn CAKE',
    subTitle: 'Total Distributed',
    btnText: 'Check Reward',
    desc: ['Weekly revenue sharing', 'Weekly CAKE pool rewards'],
  },
  gaugesVoting: {
    headImg: '/images/cake-staking/benefit-gauges-voting.png',
    title: 'Gauges Voting',
    subTitle: 'Number of Gauges to Vote',
    btnText: 'Check Gauges',
    link: '/gauges-voting',
    desc: ['Boost rewards on your favorite farms', 'Claim additional incentives from other protocols'],
  },
  farmBoost: {
    headImg: '/images/cake-staking/benefit-farm-boost.png',
    title: 'Farm Boost',
    subTitle: 'Farming Boost Up To',
    btnText: 'Check Farms',
    link: '/farms',
    desc: ['Boost your farm earnings', 'Supports multi-chain boosts'],
  },
  snapshotVoting: {
    headImg: '/images/cake-staking/benefit-snapshot-voting.png',
    title: 'Snapshot Voting',
    subTitle: 'Number of Proposals',
    btnText: 'Check Snapshot Voting',
    link: '/voting',
    desc: ['Use your veCAKE to vote on important governance proposals'],
  },
  ifo: {
    headImg: '/images/cake-staking/benefit-ifo.png',
    title: 'IFO',
    subTitle: 'Tokens Sold Through IFOs',
    btnText: 'Check IFOs',
    link: '/ifo',
    desc: ['Participate in IFO public sales', 'Supports multi-chain IFOs'],
  },
  more: {
    headImg: '/images/cake-staking/benefit-more.png',
    title: 'And So Much More...',
    btnText: 'Learn more',
    desc: [
      'Boost your winning in Trading Rewards campaigns. Regardless which chain you are trading on.',
      'Boost your earnings in fixed staking.',
      'More to come...',
    ],
    link: 'blog/@todo',
  },
}

const StyledCard = styled(Card)`
  height: 283px;
`

export const BenefitCard: React.FC<{
  type: BenefitCardType
  dataText?: string
  onClick?: () => void
}> = ({ type, onClick, dataText }) => {
  const { t } = useTranslation()
  const info = BENEFITS[type] as BenefitItem

  const button = info.btnText ? (
    <Button width="100%" mt="auto" variant={onClick ? 'primary' : 'secondary'} onClick={onClick}>
      {t(info.btnText)}
    </Button>
  ) : null

  return (
    <StyledCard innerCardProps={{ p: '24px' }}>
      <FlexGap flexDirection="column" gap="16px" height="100%" justifyContent="space-between">
        <FlexGap gap="16px" alignItems="center">
          <img srcSet={`${info.headImg} 2x`} alt="earn-cake" />
          <FlexGap flexDirection="column" gap="8px">
            <Heading as="h3" scale="lg" color="secondary">
              {t(info.title)}
            </Heading>
            {info.subTitle ? (
              <Flex flexDirection="column">
                <Text fontSize="12px" color="textSubtle" lineHeight="120%">
                  {t(info.subTitle)}
                </Text>
                <Text fontSize="16px" bold lineHeight="120%">
                  {dataText}
                </Text>
              </Flex>
            ) : null}
          </FlexGap>
        </FlexGap>
        <div>
          <Text lineHeight="130%">
            <ul>
              {info.desc.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </Text>
        </div>
        {button && info.link ? (
          <NextLinkFromReactRouter to={info.link} prefetch={false}>
            {button}
          </NextLinkFromReactRouter>
        ) : null}
        {button && !info.link && onClick ? button : null}
      </FlexGap>
    </StyledCard>
  )
}
