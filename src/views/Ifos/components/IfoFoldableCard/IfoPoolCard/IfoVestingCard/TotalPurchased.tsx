import { Flex, Box, Text, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
// import { useTranslation } from 'contexts/Localization'

const TotalPurchased: React.FC = () => {
  // const { t } = useTranslation()

  return (
    <LightGreyCard mt="35px" mb="24px">
      <Flex>
        <BunnyPlaceholderIcon mr="16px" width={32} height={32} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text color="secondary" bold fontSize="12px">
            Total XYZ purchased
          </Text>
          <Text bold fontSize="20px">
            ~234.5612
          </Text>
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalPurchased
