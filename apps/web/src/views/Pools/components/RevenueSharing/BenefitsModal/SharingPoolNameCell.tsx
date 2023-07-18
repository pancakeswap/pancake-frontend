import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, LogoRoundIcon, Box, Balance } from '@pancakeswap/uikit'
import useCakeBenefits from 'components/Menu/UserMenu/hooks/useCakeBenefits'

const SharingPoolNameCell = () => {
  const { t } = useTranslation()
  const cakePrice = usePriceCakeUSD()
  const { data: cakeBenefits } = useCakeBenefits()

  const cakeUsdValue = useMemo(
    () => new BigNumber(cakeBenefits?.lockedCake).times(cakePrice).toNumber(),
    [cakeBenefits?.lockedCake, cakePrice],
  )

  return (
    <Flex mb="16px">
      <LogoRoundIcon mr="8px" width={43} height={43} style={{ minWidth: 43 }} />
      <Box>
        <Text fontSize={12} color="secondary" bold lineHeight="110%" textTransform="uppercase">
          {t('CAKE locked')}
        </Text>
        <Balance bold decimals={2} fontSize={20} lineHeight="110%" value={Number(cakeBenefits?.lockedCake)} />
        <Balance
          bold
          prefix="~ "
          decimals={2}
          fontSize={12}
          fontWeight={400}
          lineHeight="110%"
          color="textSubtle"
          value={cakeUsdValue}
        />
      </Box>
    </Flex>
  )
}

export default SharingPoolNameCell
