import { Text, Card, Flex, Tag } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Percent } from '@pancakeswap/sdk'
import { useTokenBalance } from 'state/wallet/hooks'
import { useGetRemovedTokenAmounts } from 'views/RemoveLiquidity/RemoveStableLiquidity/hooks/useStableDerivedBurnInfo'
import { LPStablePair } from 'views/Swap/StableSwap/hooks/useStableConfig'

export function StablePairCard({ pair, account }: { pair: LPStablePair; account: string }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useGetRemovedTokenAmounts({
    lpAmount: userPoolBalance?.quotient?.toString(),
  })

  return (
    <Card mb="8px">
      <NextLink href={`/stable/${pair.liquidityToken.address}`}>
        <Flex justifyContent="space-between" p="16px">
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="4px">
              <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20} />
              <Text bold ml="8px">
                {pair.token0.symbol}/{pair.token1.symbol} Stable LP
              </Text>
              <Tag ml="8px" variant="secondary" outline>
                {new Percent(pair.stableLpFee * 1000000, 1_000_000).toSignificant()}%
              </Tag>
            </Flex>
            <Text fontSize="14px" color="textSubtle">
              {token0Deposited?.toSignificant(6)} {pair.token0.symbol} / {token1Deposited?.toSignificant(6)}{' '}
              {pair.token1.symbol}
            </Text>
          </Flex>
          <Tag ml="8px" variant="secondary" outline>
            Stable LP
          </Tag>
        </Flex>
      </NextLink>
    </Card>
  )
}
