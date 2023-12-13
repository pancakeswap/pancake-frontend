import { Trans, useTranslation } from '@pancakeswap/localization'
import { Button, Card, Flex, FlexGap, Heading, Link, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

type BenefitCardType = 'earnCake' | 'gaugesVoting' | 'farmBoost' | 'snapshotVoting' | 'ifo' | 'more'

type BenefitItem = {
  headImg: string
  title: React.ReactNode
  subTitle?: React.ReactNode
  desc: string[]
  btnText?: React.ReactNode
  link?: string
}

export const BENEFITS: Record<BenefitCardType, BenefitItem> = {
  earnCake: {
    headImg: '/images/cake-staking/benefit-earn-cake.png',
    title: <Trans>Earn CAKE</Trans>,
    subTitle: <Trans>Total Distributed</Trans>,
    btnText: <Trans>Check Reward</Trans>,
    desc: ['Weekly revenue sharing', 'Weekly CAKE pool rewards'],
  },
  gaugesVoting: {
    headImg: '/images/cake-staking/benefit-gauges-voting.png',
    title: <Trans>Gauges Voting</Trans>,
    subTitle: <Trans>Number of Gauges to Vote</Trans>,
    btnText: <Trans>Check Gauges</Trans>,
    link: '/gauges-voting',
    desc: ['Boost rewards on your favorite farms', 'Claim additional incentives from other protocols'],
  },
  farmBoost: {
    headImg: '/images/cake-staking/benefit-farm-boost.png',
    title: <Trans>Farm Boost</Trans>,
    subTitle: <Trans>Farming Boost Up To</Trans>,
    btnText: <Trans>Check Farms</Trans>,
    link: '/farms',
    desc: ['Boost your farm earnings', 'Supports multi-chain boosts'],
  },
  snapshotVoting: {
    headImg: '/images/cake-staking/benefit-snapshot-voting.png',
    title: <Trans>Snapshot Voting</Trans>,
    subTitle: <Trans>Number of Proposals</Trans>,
    btnText: <Trans>Check Snapshot Voting</Trans>,
    link: '/voting',
    desc: ['Use your veCAKE to vote on important governance proposals'],
  },
  ifo: {
    headImg: '/images/cake-staking/benefit-ifo.png',
    title: <Trans>IFO</Trans>,
    subTitle: <Trans>Tokens Sold Through IFOs</Trans>,
    btnText: <Trans>Check IFOs</Trans>,
    link: '/ifo',
    desc: ['Participate in IFO public sales', 'Supports multi-chain IFOs'],
  },
  more: {
    headImg: '/images/cake-staking/benefit-more.png',
    title: <Trans>And So Much More...</Trans>,
    btnText: <Trans>Learn more</Trans>,
    desc: [
      'Boost your winning in Trading Rewards campaigns. Regardless which chain you are trading on.',
      'Boost your earnings in fixed staking.',
      'More to come...',
    ],
    link: 'https://docs.pancakeswap.finance/products',
  },
}

const StyledCard = styled(Card)`
  height: 100%;
`

const StyleUl = styled.ul`
  list-style-type: '\u2022';
  list-style-position: outside;
  margin-left: 16px;

  li {
    padding-left: 10px;
  }
`

export const BenefitCard: React.FC<{
  type: BenefitCardType
  dataText?: string
  onClick?: () => void
  comingSoon?: boolean
  headSlot?: React.ReactNode
}> = ({ type, onClick, dataText, headSlot, comingSoon }) => {
  const { t } = useTranslation()
  const info = BENEFITS[type] as BenefitItem

  const comingSoonButton = (
    <Button width="100%" mt="auto" disabled>
      {t('Coming Soon')}
    </Button>
  )

  const button = comingSoon ? (
    comingSoonButton
  ) : info.btnText ? (
    <Button width="100%" mt="auto" variant={onClick ? 'primary' : 'secondary'} onClick={onClick}>
      {info.btnText}
    </Button>
  ) : null

  return (
    <StyledCard innerCardProps={{ p: ['16px', '16px', '24px'] }}>
      <FlexGap flexDirection="column" gap="16px" height="100%" justifyContent="space-between">
        <FlexGap gap="16px" alignItems="center">
          <HeadImage>
            <img srcSet={`${info.headImg} 2x`} alt="earn-cake" />
          </HeadImage>
          <FlexGap flexDirection="column" gap="8px">
            <Flex>
              <Heading as="h3" scale="lg" color="secondary">
                {info.title}
              </Heading>
              {headSlot}
            </Flex>
            {info.subTitle ? (
              <Flex flexDirection="column">
                <Text fontSize="12px" color="textSubtle" lineHeight="120%">
                  {info.subTitle}
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
            <StyleUl>
              {info.desc.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </StyleUl>
          </Text>
        </div>
        {button && info.link ? (
          <Link href={info.link} style={{ width: '100%' }}>
            {button}
          </Link>
        ) : null}
        {button && !info.link && onClick ? button : null}
      </FlexGap>
    </StyledCard>
  )
}

const HeadImage = styled.div`
  width: 68px;
  height: 68px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 72px;
    height: 72px;
  }

  img {
    height: 100%;
  }
`
