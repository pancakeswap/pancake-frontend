import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Column, Flex, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import NextLink from 'next/link'
import styled from 'styled-components'
import { ICampaignBanner } from './ICampaignBanner'

const MobileImage = styled.img`
  height: 80px;
  width: auto;
  margin-left: -12px;
`

export const FeeRefund: ICampaignBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  if (isMobile) {
    return (
      <Flex alignItems="center" flexWrap="nowrap">
        <MobileImage src={`${ASSET_CDN}/web/banners/fee-refund/bg-stripe-mobile.png`} alt="fee-refund-campaign" />
        <Column>
          <Text bold as="span" color="warning" fontSize={['12px', '12px', '14px']} style={{ whiteSpace: 'pre-wrap' }}>
            {t('Get up to $8M USD in interface fees refunded on PancakeSwap')}
          </Text>
          <Link
            external
            fontSize={['12px', '12px', '14px']}
            style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
            href="https://blog.pancakeswap.finance/articles/get-your-uniswap-interface-fees-refunded-on-pancake-swap-up-to-8-m?utm_source=infostripe&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund"
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
      <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
        {t('Match your Uni volume on PancakeSwap to get a refund of up to')}
      </Text>
      <Text bold as="span" color="warning" fontSize={['12px', '12px', '14px']}>
        {t('$8M USD')}
      </Text>
      <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
        {t('in Uniswap interface fees paid')}
      </Text>

      <NextLink
        href="/swap?chain=eth&utm_source=infostripe&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund"
        passHref
      >
        <Link
          href="replace"
          color="primary"
          fontSize={['12px', '12px', '14px']}
          style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
          data-dd-action-name="stripe-InterfacefeeRefund"
        >
          {t('Start Trading')}
          <ArrowForwardIcon width="14px" color="primary" />
        </Link>
      </NextLink>
      <Link
        external
        fontSize={['12px', '12px', '14px']}
        style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}
        href="https://blog.pancakeswap.finance/articles/get-your-uniswap-interface-fees-refunded-on-pancake-swap-up-to-8-m?utm_source=infostripe&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund"
      >
        {t('Learn More')}
      </Link>
    </Flex>
  )
}

FeeRefund.stripeImage = `${ASSET_CDN}/web/banners/fee-refund/bg-stripe.png`
FeeRefund.stripeImageWidth = '120px'
FeeRefund.stripeImageAlt = 'fee refund campaign'
FeeRefund.background =
  'linear-gradient(64deg, rgba(214, 126, 10, 0.26) 44.37%, rgba(255, 235, 55, 0.00) 102.8%), radial-gradient(113.12% 140.14% at 26.47% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)'
