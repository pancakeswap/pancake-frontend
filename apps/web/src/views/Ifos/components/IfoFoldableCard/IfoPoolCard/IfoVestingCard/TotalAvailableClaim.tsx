import { useMemo } from 'react'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { NumberDisplay } from '@pancakeswap/widgets-internal'
import { TokenImage } from 'components/TokenImage'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { Ifo } from '@pancakeswap/ifos'
import BigNumber from 'bignumber.js'

interface TotalAvailableClaimProps {
  ifo: Ifo
  amountAvailableToClaim: BigNumber
}

const TotalAvailableClaim: React.FC<React.PropsWithChildren<TotalAvailableClaimProps>> = ({
  ifo,
  amountAvailableToClaim,
}) => {
  const { t } = useTranslation()
  const { token } = ifo

  const amountAvailable = useMemo(
    () => (amountAvailableToClaim.gt(0) ? amountAvailableToClaim.div(10 ** token.decimals) : '0'),
    [token, amountAvailableToClaim],
  )

  return (
    <LightGreyCard mt="24px" mb="8px">
      <Flex>
        <TokenImage mr="16px" width={32} height={32} token={token} style={{ alignSelf: 'flex-start' }} />
        <Box>
          <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
            {t('%symbol% available to claim', { symbol: token.symbol })}
          </Text>
          <NumberDisplay value={amountAvailable} as="span" bold fontSize="20px" />
        </Box>
      </Flex>
    </LightGreyCard>
  )
}

export default TotalAvailableClaim
