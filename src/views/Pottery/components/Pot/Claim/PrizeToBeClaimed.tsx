import { useTranslation } from 'contexts/Localization'
import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import Balance from 'components/Balance'

const PrizeToBeClaimed: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Text fontSize="12px" color="secondary" bold as="span" textTransform="uppercase">
        {t('prize')}
      </Text>
      <Text fontSize="12px" color="textSubtle" bold as="span" ml="4px" textTransform="uppercase">
        {t('to be claimed')}
      </Text>
      <Flex>
        <Box>
          <Balance fontSize="20px" lineHeight="110%" value={5} decimals={2} bold />
          <Balance fontSize="12px" lineHeight="110%" color="textSubtle" value={200} decimals={2} unit="USD" />
        </Box>
        <Button width="162px" ml="auto">
          {t('Claim')}
        </Button>
      </Flex>
    </Box>
  )
}

export default PrizeToBeClaimed
