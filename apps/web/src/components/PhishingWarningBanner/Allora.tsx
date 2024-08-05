import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Column, Flex, FlexGap, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import NextLink from 'next/link'
import { ICampaignBanner } from './ICampaignBanner'

const ALLORA_PATH = `${ASSET_CDN}/web/banners/allora`

const learnMoreLink = 'https://www.allora.network/blog/announcing-the-allora-x-pancakeswap-points-program'
const joinNowLink =
  'https://pancakeswap.finance/prediction?token=ETH&chain=arb&utm_source=homepagebanner&utm_medium=website&utm_campaign=Arbitrum&utm_id=AlloraPointsPrediction'

export const Allora: ICampaignBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const content = (
    <Box>
      <Text bold as="span" color="white" fontSize={['12px', '12px', '13px']}>
        {t('Earn Allora Points on PancakeSwap')}
      </Text>
      <Text bold as="span" color="warning" fontSize={['12px', '12px', '13px']}>
        {t('Predict the ETH price on Arbitrum and participate in the Galxe campaign')}
      </Text>
    </Box>
  )

  const mobileContent = (
    <Box>
      <Text bold as="span" color="warning" fontSize={['12px', '12px', '13px']}>
        {t('Earn Allora Points by')}
      </Text>
      <Text bold as="span" color="white" fontSize={['12px', '12px', '13px']}>
        {t('playing ARB predictions')}
      </Text>
      <Text bold as="span" color="warning" fontSize={['12px', '12px', '13px']}>
        {t('and Galxe campaign!')}
      </Text>
    </Box>
  )

  if (isMobile) {
    return (
      <Flex alignItems="center" flexWrap="nowrap">
        <img src={`${ALLORA_PATH}/top-bg-mobile.png`} alt="fee-refund-campaign" width="80px" height="80px" />
        <Column ml="16px">
          {mobileContent}
          <FlexGap mt="6px">
            <Link external fontSize={['12px', '12px', '14px']} style={{ color: 'white' }} href={joinNowLink}>
              {t('Join now')}
              <ArrowForwardIcon width="14px" color="white" />
            </Link>
            <VerticalDivider />

            <Link external color="white" ml="6px" fontSize={['12px', '12px', '14px']} href={learnMoreLink}>
              {t('Learn More')}
              <ArrowForwardIcon width="14px" color="white" />
            </Link>
          </FlexGap>
        </Column>
      </Flex>
    )
  }

  return (
    <Flex mr={['6px']} alignItems="center" flexWrap="wrap">
      {content}
      <FlexGap>
        <NextLink href={joinNowLink} passHref>
          <Link href="replace" color="white" fontSize={['12px', '12px', '14px']}>
            {t('Join now')}
          </Link>
        </NextLink>
        <Link external mx="6px" color="white" href={learnMoreLink} fontSize={['12px', '12px', '14px']}>
          {t('Learn More')}
        </Link>
      </FlexGap>
    </Flex>
  )
}

Allora.stripeImage = `${ALLORA_PATH}/top-bg.png`
Allora.stripeImageWidth = '120px'
Allora.stripeImageAlt = 'allora campaign'
Allora.background = 'radial-gradient(63.28% 84.72% at 26.41% 23.33%, #CBD7EF 0%, #A3A9D5 72.82%, #9A9FD0 100%)'
