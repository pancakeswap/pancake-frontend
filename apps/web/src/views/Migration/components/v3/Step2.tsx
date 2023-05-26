/* eslint-disable react/jsx-pascal-case */
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { AtomBox } from '@pancakeswap/ui'
import { Button, Card, Dots, Flex, Modal, ModalV2, Tag, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import { DoubleCurrencyLogo } from 'components/Logo'
import { PositionCardProps, withLPValues, withStableLPValues } from 'components/PositionCard'
import { PairState, useV2Pairs } from 'hooks/usePairs'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Field } from 'state/burn/actions'
import { useBurnActionHandlers } from 'state/burn/hooks'
import { useFarmsV3Public } from 'state/farmsV3/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import atomWithStorage from 'utils/atomWithStorageWithErrorCatch'
import currencyId from 'utils/currencyId'
import RemoveLiquidity from 'views/RemoveLiquidity'
import RemoveStableLiquidity from 'views/RemoveLiquidity/RemoveStableLiquidity'
import useStableConfig, { StableConfigContext, useLPTokensWithBalanceByAccount } from 'views/Swap/hooks/useStableConfig'
import { useAccount } from 'wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

export const STABLE_LP_TO_MIGRATE = [
  '0x36842F8fb99D55477C0Da638aF5ceb6bBf86aA98', // USDT-BUSD
  '0x1A77C359D0019cD8F4d36b7CDf5a88043D801072', // USDC-BUSD
  '0xee1bcc9F1692E81A281b3a302a4b67890BA4be76', // USDT-USDC
  '0x9976f5c8BEfDee650226d5571d5F5551e8722b75', // WBNB-STKBNB
]

export function Step2() {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const {
    data: { farmsWithPrice },
  } = useFarmsV3Public()

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

  let stablePairs = useLPTokensWithBalanceByAccount(account)

  stablePairs = stablePairs.filter((pair) => STABLE_LP_TO_MIGRATE.includes(pair.liquidityToken.address))

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const activeV3Farms = farmsWithPrice.filter((farm) => farm.multiplier !== '0X')

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .filter(([, pair]) =>
      activeV3Farms.find((farm) => pair.token0.equals(farm.token0) && pair.token1.equals(farm.token1)),
    )
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
            {allV2PairsWithLiquidity?.map((pair) => (
              <LpCard key={pair.liquidityToken.address} pair={pair} />
            ))}
            {stablePairs?.map((pair) => (
              <StableLpCard key={pair.liquidityToken.address} pair={pair} />
            ))}
          </>
        )}
      </AtomBox>
    </AppBody>
  )
}

export const removedPairsAtom = atomWithStorage(
  'v3-migration-remove-pairs-2',
  {} as Record<
    ChainId,
    {
      [account: string]: { [tokenAddresses: string]: true }
    }
  >,
)

interface MigrationPositionCardProps extends PositionCardProps {
  type: 'V2' | 'Stable'
}

const LPCard_ = ({
  currency0,
  currency1,
  userPoolBalance,
  totalUSDValue,
  children,
  pair,
  type,
}: MigrationPositionCardProps) => {
  const { account, chainId } = useAccountActiveChain()
  const [, setRemovedPairs] = useAtom(removedPairsAtom)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { onUserInput } = useBurnActionHandlers()
  const { isMobile } = useMatchBreakpoints()

  useEffect(() => {
    if (open) {
      onUserInput(Field.LIQUIDITY_PERCENT, '100')
    }
  }, [onUserInput, open])

  useEffect(() => {
    if (open && pair && account && chainId) {
      setRemovedPairs((s) => ({
        ...s,
        [chainId]: {
          ...s?.[chainId],
          [account]: {
            ...s?.[chainId]?.[account],
            [`${pair.token0.address}-${pair.token1.address}`]: true,
          },
        },
      }))
    }
  }, [setRemovedPairs, open, pair, chainId, account])

  return (
    <Card mb="8px">
      <Flex justifyContent="space-between" p="16px" flexWrap={['wrap', 'wrap', 'nowrap']}>
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
            {type} LP
          </Tag>
          {!isMobile && <Button onClick={() => setOpen(true)}>Remove</Button>}
        </Flex>
        <ModalV2 isOpen={open}>
          <Modal
            title={t('Remove %assetA%-%assetB% Liquidity', {
              assetA: currency0?.symbol ?? '',
              assetB: currency1?.symbol ?? '',
            })}
            onDismiss={() => setOpen(false)}
          >
            {children}
          </Modal>
        </ModalV2>
        {isMobile && (
          <Button mt="8px" width="100%" onClick={() => setOpen(true)}>
            Remove
          </Button>
        )}
      </Flex>
    </Card>
  )
}

const StableLpCard_ = (props) => {
  return (
    <LPCard_ {...props} type="Stable">
      <RemoveStableLiquidity
        currencyA={props.currency0}
        currencyB={props.currency1}
        currencyIdA={currencyId(props.currency0)}
        currencyIdB={currencyId(props.currency1)}
      />
    </LPCard_>
  )
}

const V2LpCard_ = (props) => {
  return (
    <LPCard_ {...props} type="V2">
      <RemoveLiquidity
        currencyA={props.currency0}
        currencyB={props.currency1}
        currencyIdA={currencyId(props.currency0)}
        currencyIdB={currencyId(props.currency1)}
      />
    </LPCard_>
  )
}

const LpCard = withLPValues(V2LpCard_)

const StableLpCardWithLPValues = withStableLPValues(StableLpCard_)

const StableLpCard = (props) => {
  const { pair } = props
  const stableConfig = useStableConfig({
    tokenA: pair?.token0,
    tokenB: pair?.token1,
  })

  if (!stableConfig.stableSwapConfig) return null

  return (
    <StableConfigContext.Provider value={stableConfig}>
      <StableLpCardWithLPValues {...props} />
    </StableConfigContext.Provider>
  )
}
