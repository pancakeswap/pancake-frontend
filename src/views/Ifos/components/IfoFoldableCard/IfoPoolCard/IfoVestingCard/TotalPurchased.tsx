import { Flex, Box, Text } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { TokenImage } from 'components/TokenImage'
import BalanceWithLoading from 'components/Balance'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData } from 'views/Ifos/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'

interface TotalPurchasedProps {
  ifo: Ifo
  poolId: PoolIds
  walletIfoData: WalletIfoData
}

const TotalPurchased: React.FC<React.PropsWithChildren<TotalPurchasedProps>> = ({ ifo, poolId, walletIfoData }) => {
  const { t } = useTranslation()
  const { token } = ifo
  const { offeringAmountInToken, amountTokenCommittedInLP, refundingAmountInLP } = walletIfoData[poolId]

  return (
    <LightGreyCard mt="35px" mb="24px">
      <Flex>
        <TokenImage mr="16px" width={32} height={32} token={token} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
            {t('Total %symbol% purchased', { symbol: token.symbol })}
          </Text>
          <BalanceWithLoading
            bold
            prefix="~"
            decimals={4}
            fontSize="20px"
            value={getBalanceNumber(offeringAmountInToken, token.decimals)}
          />
        </Box>
      </Flex>
      <Flex>
        <TokenImage mr="16px" width={32} height={32} token={ifo.currency} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
            {t('Your %symbol% committed', { symbol: ifo.currency.symbol })}
          </Text>
          <BalanceWithLoading
            bold
            decimals={4}
            fontSize="20px"
            value={getBalanceNumber(amountTokenCommittedInLP, token.decimals)}
          />
        </Box>
      </Flex>
      <Flex ml="48px">
        <Box>
          <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
            {t('Your %symbol% refunds', { symbol: ifo.currency.symbol })}
          </Text>
          <BalanceWithLoading
            bold
            prefix="~"
            decimals={4}
            fontSize="20px"
            value={getBalanceNumber(refundingAmountInLP, token.decimals)}
          />
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalPurchased
