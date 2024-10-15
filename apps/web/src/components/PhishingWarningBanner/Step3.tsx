import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, Flex, Link, Text } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'

export const Step3 = () => {
  const { t } = useTranslation()

  // const PlayNowAction = (
  //   <LinkExternalAction
  //     href="https://pancakeswap.finance/swap?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
  //     color="#280D5F"
  //     externalIcon="arrowForward"
  //   >
  //     <Flex color="#280D5F" alignItems="center" style={{ whiteSpace: 'nowrap' }}>
  //       {t('Swap Now')}
  //     </Flex>
  //   </LinkExternalAction>
  // )

  return (
    <Flex mr={['6px']} flexDirection="row" alignItems="center">
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
        display="inline !important"
        showExternalIcon
        fontSize={['12px', '12px', '14px']}
        href="https://pancakeswap.finance/swap?utm_source=Website&utm_medium=homepage&utm_campaign=PCSX&utm_id=PCSX"
      >
        <Box
          style={{
            display: 'flex',
            verticalAlign: 'middle',
            flexDirection: 'row',
          }}
        >
          {t('Swap Now')}
          <ArrowForwardIcon
            style={{
              fill: '#53DEE9',
            }}
          />
        </Box>
      </Link>
      <VerticalDivider
        bg="#53DEE9"
        style={{
          opacity: 0.4,
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
    </Flex>
  )
}
