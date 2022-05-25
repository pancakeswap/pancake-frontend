import { Flex, Box, Text, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import BalanceWithLoading from 'components/Balance'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData } from 'views/Ifos/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'

interface TotalPurchasedProps {
  ifo: Ifo
  poolId: PoolIds
  walletIfoData: WalletIfoData
}

const TotalPurchased: React.FC<TotalPurchasedProps> = ({ ifo, poolId, walletIfoData }) => {
  const { t } = useTranslation()
  const { token } = ifo
  const userPoolCharacteristics = walletIfoData[poolId]

  return (
    <LightGreyCard mt="35px" mb="24px">
      <Flex>
        <BunnyPlaceholderIcon mr="16px" width={32} height={32} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text color="secondary" bold fontSize="12px">
            {t('Total %symbol% purchased', { symbol: token.symbol })}
          </Text>
          <BalanceWithLoading
            bold
            prefix="~"
            decimals={3}
            fontSize="20px"
            value={getBalanceNumber(userPoolCharacteristics.offeringAmountInToken, token.decimals)}
          />
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalPurchased
