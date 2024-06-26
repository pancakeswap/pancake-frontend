import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Column, Flex, FlexGap, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'
import { ICampaignBanner } from './ICampaignBanner'

const MobileImage = styled.img`
  height: auto;
  width: auto;
  max-width: 110px;
  margin-left: -12px;
`

export const PerpetualSeason: ICampaignBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const content = (
    <Box>
      <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
        🏆 {t('Trade and Win')}
      </Text>
      <Text bold as="span" color="warning" fontSize={['12px', '12px', '14px']}>
        {t('300,000 $ARB')}
      </Text>
      <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
        {t('on PancakeSwap Perpetuals v2!')}
      </Text>
    </Box>
  )

  if (isMobile) {
    return (
      <Flex alignItems="center" flexWrap="nowrap">
        <MobileImage
          src={`${ASSET_CDN}/web/banners/perpetual-season-banner/stripe-mobile.png`}
          alt="perpetual-season-stripe"
        />
        <Column>
          {content}
          <Link
            external
            fontSize={['12px', '12px', '14px']}
            style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
            href="https://blog.pancakeswap.finance/articles/trade-on-arbitrum-pancake-swap-perpetual-v2-to-win-300-000-arb?utm_source=infostripe&utm_medium=website&utm_campaign=PerpARBIncentives&utm_id=ARBincentives"
          >
            {t('Learn More')}
            <ArrowForwardIcon width="14px" mt="2px" color="primary" />
          </Link>
        </Column>
      </Flex>
    )
  }

  return (
    <Flex mr={['6px']} alignItems="center" flexWrap="wrap">
      {content}
      <FlexGap>
        <Link
          color="primary"
          fontSize={['12px', '12px', '14px']}
          style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
          href="https://perp.pancakeswap.finance/en/futures/v2/BTCUSD?chain=Arbitrum&utm_source=infostripe&utm_medium=website&utm_campaign=PerpARBIncentives&utm_id=ARBincentives"
        >
          {t('Start Trading')}
          <ArrowForwardIcon width="14px" color="primary" style={{ marginRight: '-8px' }} />
        </Link>
        <VerticalDivider bg="rgba(31, 199, 212, 0.4)" />
        <Link
          external
          fontSize={['12px', '12px', '14px']}
          style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
          href="https://blog.pancakeswap.finance/articles/trade-on-arbitrum-pancake-swap-perpetual-v2-to-win-300-000-arb?utm_source=infostripe&utm_medium=website&utm_campaign=PerpARBIncentives&utm_id=ARBincentives"
        >
          {t('Learn More')}
        </Link>
      </FlexGap>
    </Flex>
  )
}

PerpetualSeason.stripeImage = `${ASSET_CDN}/web/banners/perpetual-season-banner/stripe.png`
PerpetualSeason.stripeImageWidth = '120px'
PerpetualSeason.stripeImageAlt = 'Perpetual Season'
PerpetualSeason.background = 'rgba(118, 69, 217, 1)'
