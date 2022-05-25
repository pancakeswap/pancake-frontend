import { Flex, Box, Text, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { Ifo } from 'config/constants/types'

interface TotalAvailableClaimProps {
  ifo: Ifo
}

const TotalAvailableClaim: React.FC<TotalAvailableClaimProps> = ({ ifo }) => {
  const { t } = useTranslation()
  const { token } = ifo

  return (
    <LightGreyCard mt="24px" mb="8px">
      <Flex>
        <BunnyPlaceholderIcon mr="16px" width={32} height={32} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text bold color="secondary" fontSize="12px">
            {t('%symbol% available to claim', { symbol: token.symbol })}
          </Text>
          <Text as="span" bold fontSize="20px">
            52.1234
          </Text>
          <Text as="span" bold color="textSubtle" fontSize="20px">
            /234.5612
          </Text>
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalAvailableClaim
