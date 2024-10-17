import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Link, Text } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'

export const Step3 = () => {
  const { t } = useTranslation()

  return (
    <Box mr={['6px']}>
      <Text bold as="span" color="#FFFFFF" fontSize={['12px', '12px', '14px']}>
        {t('Enjoy')}
      </Text>
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        {t('Zero')}
      </Text>
      <Text bold as="span" color="#FFFFFF" fontSize={['12px', '12px', '14px']}>
        {t('trading and gas fees on Ethereum and Arbitrum with')}
      </Text>
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        PancakeSwapX
      </Text>
      <Link
        external
        display="inline-flex !important"
        verticalAlign="baseline"
        showExternalIcon
        fontSize={['12px', '12px', '14px']}
        href="https://pancakeswap.finance/swap?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
      >
        {t('Swap Now')}
        <ArrowForwardIcon
          style={{
            fill: '#53DEE9',
          }}
        />
      </Link>
      <VerticalDivider
        bg="#53DEE9"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          height: '18px',
          opacity: 0.4,
          width: '1px',
          marginLeft: '0px',
          marginRight: '8px',
        }}
      />
      <Link
        external
        display="inline !important"
        showExternalIcon
        fontSize={['12px', '12px', '14px']}
        href="https://blog.pancakeswap.finance/articles/introducing-pancake-swap-x-zero-fee-and-gasless-swaps-on-ethereum-and-arbitrum?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
      >
        {t('Learn More')}
      </Link>
    </Box>
  )
}
