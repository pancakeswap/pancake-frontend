import { useMemo } from 'react'
import { Flex, Box, Text, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { Ifo } from 'config/constants/types'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

interface TotalAvailableClaimProps {
  ifo: Ifo
  amountAvailableToClaim: BigNumber
}

const TotalAvailableClaim: React.FC<TotalAvailableClaimProps> = ({ ifo, amountAvailableToClaim }) => {
  const { t } = useTranslation()
  const { token } = ifo

  const amountAvailable = useMemo(() => {
    const amount = getBalanceNumber(amountAvailableToClaim, token.decimals)
    return amount > 0 ? formatNumber(amount, 4, 4) : 0
  }, [token, amountAvailableToClaim])

  return (
    <LightGreyCard mt="24px" mb="8px">
      <Flex>
        <BunnyPlaceholderIcon mr="16px" width={32} height={32} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text bold color="secondary" fontSize="12px">
            {t('%symbol% available to claim', { symbol: token.symbol })}
          </Text>
          <Text as="span" bold fontSize="20px">
            {amountAvailable}
          </Text>
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalAvailableClaim
