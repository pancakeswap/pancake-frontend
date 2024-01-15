import { useAccount } from '@pancakeswap/awgmi'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { Balance, Box, Flex, Text, TooltipText, WarningIcon, useTooltip } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { formatNumber, getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import { useCheckIsUserIpPass } from 'components/Farms/hooks/useCheckIsUserIpPass'
import { usePriceCakeUsdc, useTokenUsdcPrice } from 'hooks/useStablePrice'
import { useMemo } from 'react'

interface EarnedUsdPriceProps extends FarmWithStakedValue {
  isCardView?: boolean
}

export const EarnedUsdPrice: React.FC<React.PropsWithChildren<EarnedUsdPriceProps>> = ({
  isCardView,
  dual,
  userData,
}) => {
  const { account } = useAccount()
  const isUserIpPass = useCheckIsUserIpPass()
  const { earnings, earningsDualTokenBalance } = userData ?? {}

  const cakePrice = usePriceCakeUsdc()
  const rawEarningsBalance = account ? getBalanceAmount(earnings as BigNumber, FARM_DEFAULT_DECIMALS) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(2, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.times(cakePrice ?? 0).toNumber() : 0

  // Dual Token
  const dualEarningsBalance = account
    ? getBalanceAmount(earningsDualTokenBalance as BigNumber, dual?.token?.decimals)
    : BIG_ZERO
  const dualTokenDisplayBalance = dualEarningsBalance.toFixed(2, BigNumber.ROUND_DOWN)
  const dualTokenPrice = useTokenUsdcPrice(dual?.token)
  const dualTokenUsdc = dualTokenDisplayBalance ? dualEarningsBalance.times(dualTokenPrice ?? 0).toNumber() : 0

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>{`${displayBalance} CAKE (~${formatNumber(earningsBusd, 2, 2)} USD)`}</Text>
      <Text>{`${dualTokenDisplayBalance} ${dual?.token?.symbol} (~${formatNumber(dualTokenUsdc, 2, 2)} USD)`}</Text>
    </Box>,
    {
      placement: 'top',
    },
  )

  const totalUsdPrice = useMemo(
    () => new BigNumber(earningsBusd).plus(dualTokenUsdc).toNumber(),
    [earningsBusd, dualTokenUsdc],
  )

  return (
    <Box>
      <TooltipText ref={targetRef}>
        <Flex flexDirection={isCardView ? 'row-reverse' : 'row'}>
          {!isUserIpPass && <WarningIcon m="0 4px" color="failure" width="20px" />}
          <Balance prefix="~" value={totalUsdPrice} decimals={2} unit=" USD" />
        </Flex>
      </TooltipText>
      {tooltipVisible && tooltip}
    </Box>
  )
}
