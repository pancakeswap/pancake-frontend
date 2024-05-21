import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Flex, Link, RowBetween, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import NextLink from 'next/link'
import { ICampaignBanner } from './ICampaignBanner'

export const FeeRefund: ICampaignBanner = () => {
  const { t } = useTranslation()

  return (
    <RowBetween mr={['6px']} alignItems="center" flexWrap="nowrap">
      <p>
        <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
          {t('Match your Uni volume on PancakeSwap to get a refund of up to')}
        </Text>
        <Text bold as="span" color="warning" fontSize={['12px', '12px', '14px']}>
          {t('$8M USD')}
        </Text>
        <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
          {t('in Uniswap interface fees paid')}
        </Text>
      </p>
      <Flex>
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
          display="inline !important"
          fontSize={['12px', '12px', '14px']}
          href="https://blog.pancakeswap.finance/articles/get-your-uniswap-interface-fees-refunded-on-pancake-swap-up-to-8-m?utm_source=infostripe&utm_medium=Ethereum&utm_campaign=Swap&utm_id=InterfacefeeRefund"
        >
          {t('Learn More')}
        </Link>
      </Flex>
    </RowBetween>
  )
}

FeeRefund.stripeImage = `${ASSET_CDN}/web/banners/fee-refund/bg-stripe.png`
FeeRefund.stripeImageWidth = '120px'
FeeRefund.stripeImageAlt = 'fee refund campaign'
FeeRefund.background =
  'linear-gradient(64deg, rgba(214, 126, 10, 0.26) 44.37%, rgba(255, 235, 55, 0.00) 102.8%), radial-gradient(113.12% 140.14% at 26.47% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)'
