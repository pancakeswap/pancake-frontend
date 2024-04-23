import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Flex, Link, Text } from '@pancakeswap/uikit'

import { styled } from 'styled-components'

const VerticalDivider = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  width: 1px;
  height: 1rem;
  margin-right: 8px;
`

export const Step3 = () => {
  const { t } = useTranslation()

  return (
    <Flex mr={['6px']} alignItems="center" flexWrap="wrap">
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        {t('Join the MASA Trading Competition')}
      </Text>
      <Text bold as="span" color="white" fontSize={['12px', '12px', '14px']}>
        {t('to Win 700,000 $MASA')}
      </Text>
      <Link
        href="https://pancakeswap.finance/swap?outputCurrency=0x944824290CC12F31ae18Ef51216A223Ba4063092&utm_source=PCSWebsite&utm_medium=HomePageBanner&utm_campaign=SwapMASA&utm_id=MASATradingCompetition"
        color="primary"
        fontSize={['12px', '12px', '14px']}
        style={{ display: 'flex', alignItems: 'center', gap: 3 }}
        data-dd-action-name="Masa trading competition"
      >
        {t('Start Trading')}
        <ArrowForwardIcon width="14px" color="primary" />
      </Link>
      <VerticalDivider />
      <Link
        external
        display="inline !important"
        fontSize={['12px', '12px', '14px']}
        href="https://blog.pancakeswap.finance/articles/join-the-masa-trading-competition-on-pancake-swap-to-win-700-000-masa?utm_source=PCSWebsite&utm_medium=SwapPage&utm_campaign=MASATradingCompetition&utm_id=MASATradingCompetition"
      >
        {t('Learn More')}
      </Link>
    </Flex>
  )
}
