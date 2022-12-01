import { Flex, Box, Text, BalanceWithLoading } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { TokenImage } from 'components/TokenImage'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { Currency } from '@pancakeswap/aptos-swap-sdk'

interface TotalPurchasedProps {
  token: Currency
  totalPurchased: BigNumber
}

const TotalPurchased: React.FC<React.PropsWithChildren<TotalPurchasedProps>> = ({ token, totalPurchased }) => {
  const { t } = useTranslation()

  return (
    <LightGreyCard mt="24px" mb="24px">
      <Flex>
        <TokenImage mr="16px" width={32} height={32} token={token} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text color="secondary" bold fontSize="12px">
            {t('Total %symbol% purchased', { symbol: token.symbol })}
          </Text>
          <BalanceWithLoading
            bold
            prefix="~"
            decimals={4}
            fontSize="20px"
            value={getBalanceNumber(totalPurchased, token.decimals)}
          />
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalPurchased
