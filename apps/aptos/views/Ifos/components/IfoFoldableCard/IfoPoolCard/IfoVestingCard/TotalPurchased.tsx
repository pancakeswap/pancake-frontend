import { Flex, Box, Text } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { TokenImage } from 'components/TokenImage'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
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
          <Text as="span" bold fontSize="20px">
            ~{getFullDisplayBalance(totalPurchased, token.decimals, token.decimals)}
          </Text>
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalPurchased
