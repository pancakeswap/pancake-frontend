import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import { StyledPriceChart } from './styles'

interface BnbWbnbNoticeProps {
  isDark: boolean
  isChartExpanded: boolean
}

const BnbWbnbNotice: React.FC<BnbWbnbNoticeProps> = ({ isDark, isChartExpanded }) => {
  const { t } = useTranslation()
  return (
    <StyledPriceChart $isDark={isDark} $isExpanded={isChartExpanded} p="24px">
      <Flex justifyContent="center" alignItems="center" height="100%" flexDirection="column">
        <Text mb={['8px', '8px', '0px']} textAlign="center">
          {t('You can swap WBNB for BNB (and vice versa) with no trading fees.')}
        </Text>
        <Text mb={['8px', '8px', '0px']} textAlign="center">
          {t('Exchange rate is always 1 to 1.')}
        </Text>
      </Flex>
    </StyledPriceChart>
  )
}

export default BnbWbnbNotice
