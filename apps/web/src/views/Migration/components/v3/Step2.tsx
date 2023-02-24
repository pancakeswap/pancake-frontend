import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { Button, Card, Dots, Flex, Modal, ModalV2, Tag, Text } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import { DoubleCurrencyLogo } from 'components/Logo'
import { PositionCardProps, withLPValues } from 'components/PositionCard'
import { PairState, usePairs } from 'hooks/usePairs'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import atomWithStorage from 'utils/atomWithStorageWithErrorCatch'
import { useLPTokensWithBalanceByAccount } from 'views/Swap/StableSwap/hooks/useStableConfig'
import { useAccount } from 'wagmi'
import RemoveLiquidity from 'views/RemoveLiquidity'
import currencyId from 'utils/currencyId'

// TODO: v3 migration add whitelist stable pairs
export function Step2() {
  const { address: account } = useAccount()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  const stablePairs = useLPTokensWithBalanceByAccount(account)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const noLiquidity = !allV2PairsWithLiquidity?.length && !stablePairs?.length

  return (
    <AppBody style={{ maxWidth: '700px' }} m="auto">
      <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
      <AtomBox bg="gradientCardHeader" style={{ minHeight: '400px' }} px="24px" pt="16px">
        {!account ? (
          <AtomBox pt="24px" textAlign="center">
            <Text color="textSubtle" textAlign="center" pt="24px" bold fontSize="16px">
              {t('Connect to a wallet to view your liquidity.')}
            </Text>
          </AtomBox>
        ) : v2IsLoading ? (
          <Text color="textSubtle" textAlign="center" pt="24px" bold fontSize="16px">
            <Dots>{t('Loading')}</Dots>
          </Text>
        ) : noLiquidity ? (
          <AtomBox pt="24px" textAlign="center">
            <Text color="textSubtle" textAlign="center" bold fontSize="16px">
              {t('No liquidity found.')}
            </Text>
            <Image src="/images/decorations/liquidity.png" width={174} height={184} alt="liquidity-image" />
          </AtomBox>
        ) : (
          <>
            {allV2PairsWithLiquidity.map((pair) => (
              <LpCard key={pair.liquidityToken.address} pair={pair} />
            ))}
          </>
        )}
      </AtomBox>
    </AppBody>
  )
}

export const removedPairsAtom = atomWithStorage(
  'v3-migration-remove-pairs',
  {} as Record<ChainId, { [pairAddress: string]: boolean }>,
)

const LPCard_ = ({ currency0, currency1, userPoolBalance, totalUSDValue }: PositionCardProps) => {
  const [, _setRemovedPairs] = useAtom(removedPairsAtom)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <Card mb="8px">
      <Flex justifyContent="space-between" p="16px">
        <Flex flexDirection="column">
          <Flex alignItems="center" mb="4px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text bold ml="8px">
              {!currency0 || !currency1 ? <Dots>{t('Loading')}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>
          <Text fontSize="14px" color="textSubtle">
            {userPoolBalance?.toSignificant(4)}
          </Text>
          {Number.isFinite(totalUSDValue) && (
            <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} USD)`}</Text>
          )}
        </Flex>
        <Flex alignItems="center">
          <Tag variant="textSubtle" outline mr="16px">
            V2 LP
          </Tag>
          <Button onClick={() => setOpen(true)}>Remove</Button>
        </Flex>
      </Flex>
      <ModalV2 isOpen={open}>
        <Modal
          title={t('Remove %assetA%-%assetB% liquidity', {
            assetA: currency0?.symbol ?? '',
            assetB: currency1?.symbol ?? '',
          })}
          onDismiss={() => setOpen(false)}
        >
          <RemoveLiquidity
            currencyA={currency0}
            currencyB={currency1}
            currencyIdA={currencyId(currency0)}
            currencyIdB={currencyId(currency1)}
          />
        </Modal>
      </ModalV2>
    </Card>
  )
}

const LpCard = withLPValues(LPCard_)
