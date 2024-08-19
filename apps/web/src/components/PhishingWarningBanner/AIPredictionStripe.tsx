import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Column, Flex, FlexGap, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

const MobileImage = styled.img`
  height: auto;
  width: auto;
  max-width: 110px;
  margin-left: -12px;
`

const stripeImage = `${ASSET_CDN}/web/banners/ai-prediction/info-strip-logo.png`
const stripeImageAlt = 'AI Predictions'

const defaultCtaLink =
  '/prediction?token=ETH&chain=arb&utm_source=infostripe&utm_medium=website&utm_campaign=Arbitrum&utm_id=PredictionLaunch'
const defaultLearnMoreLink =
  'https://blog.pancakeswap.finance/articles/pancake-swap-introduces-ai-powered-prediction-market-on-arbitrum-up-to-100-fund-protection-and-launching-60-000-arb-campaign?utm_source=infostripe&utm_medium=website&utm_campaign=Arbitrum&utm_id=PredictionLaunch'

interface AIPredictionStripeProps {
  ctaLink?: string
  learnMoreLink?: string
}

export const AIPrediction = ({
  ctaLink = defaultCtaLink,
  learnMoreLink = defaultLearnMoreLink,
}: AIPredictionStripeProps) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  if (isMobile) {
    return (
      <Flex alignItems="center" flexWrap="nowrap">
        <MobileImage src={stripeImage} alt={stripeImageAlt} />
        <Column>
          <Box>
            <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
              {t('Predict ETH Price on Arbitrum & Win')}
            </Text>
            <Text bold as="span" color="#FFE238" fontSize={['12px', '12px', '14px']}>
              {t('60,000 $ARB')}{' '}
            </Text>
            <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
              {t('Reward!')}
            </Text>
          </Box>
          <Link
            color="primary"
            fontSize={['12px', '12px', '12px']}
            style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
            href={ctaLink}
          >
            {t('Participate Now')}
            <ArrowForwardIcon width="12px" color="primary" style={{ marginRight: '-8px' }} />
          </Link>
        </Column>
      </Flex>
    )
  }

  return (
    <Flex mr={['6px']} alignItems="center" flexWrap="wrap">
      <Box>
        <Text bold as="span" color="white" fontSize={['12px', '12px', '12px']}>
          {t("PancakeSwap's AI-Prediction Market is now live on Arbitrum.")}
        </Text>
        <Text bold as="span" color="#FFE238" fontSize={['12px', '12px', '12px']}>
          {t('60,000 ARB')}{' '}
        </Text>
        <Text bold as="span" color="white" fontSize={['12px', '12px', '12px']}>
          {t('in rewards and up to 100% Fund Protection.')}
        </Text>
      </Box>
      <FlexGap>
        <Link
          color="primary"
          fontSize={['12px', '12px', '12px']}
          style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
          href={ctaLink}
        >
          {t('Participate Now')}
          <ArrowForwardIcon width="12px" color="primary" style={{ marginRight: '-8px' }} />
        </Link>
        <VerticalDivider bg="rgba(31, 199, 212, 0.4)" />
        <Link
          external
          fontSize={['12px', '12px', '12px']}
          style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
          href={learnMoreLink}
        >
          {t('Learn More')}
        </Link>
      </FlexGap>
    </Flex>
  )
}

AIPrediction.stripeImage = stripeImage
AIPrediction.stripeImageWidth = '120px'
AIPrediction.stripeImageAlt = stripeImageAlt
AIPrediction.background = '#213147'
