import { useTokenBalance } from 'state/wallet/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTokensDeposited } from 'components/PositionCard'
import { Card, Flex, Text, Tag } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Pair } from '@pancakeswap/sdk'

export function V2PairCard({ pair, account }: { pair: Pair; account: string }) {
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

  return (
    <Card mb="8px">
      <NextLink href={`/pool-v2/${pair.token0.address}/${pair.token1.address}`}>
        <Flex justifyContent="space-between" p="16px">
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="4px">
              <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20} />
              <Text bold ml="8px">
                {pair.token0.symbol}/{pair.token1.symbol} V2 LP
              </Text>
            </Flex>
            <Text fontSize="14px" color="textSubtle">
              {token0Deposited?.toSignificant(6)} {pair.token0.symbol} / {token1Deposited?.toSignificant(6)}{' '}
              {pair.token1.symbol}
            </Text>
          </Flex>
          <Tag ml="8px" variant="failure" outline>
            V2 LP
          </Tag>
        </Flex>
      </NextLink>
    </Card>
  )
}
