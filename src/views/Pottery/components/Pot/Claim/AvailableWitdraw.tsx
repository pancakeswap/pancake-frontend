import { useTranslation } from 'contexts/Localization'
import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import Balance from 'components/Balance'

const AvailableWitdraw: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box m="20px 0">
      <Text fontSize="12px" color="secondary" bold as="span" textTransform="uppercase">
        {t('stake withdraw')}
      </Text>
      <Text fontSize="12px" color="textSubtle" bold as="span" ml="4px" textTransform="uppercase">
        {t('available')}
      </Text>
      <Flex mb="11px">
        <Box>
          <Balance fontSize="20px" lineHeight="110%" value={5} decimals={2} bold />
          <Balance fontSize="12px" lineHeight="110%" color="textSubtle" value={200} decimals={2} unit="USD" />
          <Text fontSize="12px" lineHeight="110%" color="textSubtle">
            Deposited Apr 04 2022
          </Text>
        </Box>
        <Button variant="secondary" width="162px" ml="auto">
          {t('Withdraw')}
        </Button>
      </Flex>
      <Flex mb="11px">
        <Box>
          <Balance fontSize="20px" lineHeight="110%" value={5} decimals={2} bold />
          <Balance fontSize="12px" lineHeight="110%" color="textSubtle" value={200} decimals={2} unit="USD" />
          <Text fontSize="12px" lineHeight="110%" color="textSubtle">
            Deposited Apr 04 2022
          </Text>
        </Box>
        <Button variant="secondary" width="162px" ml="auto">
          {t('Withdraw')}
        </Button>
      </Flex>
    </Box>
  )
}

export default AvailableWitdraw
