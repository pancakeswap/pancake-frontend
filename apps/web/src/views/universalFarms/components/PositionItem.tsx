import BigNumber from 'bignumber.js'
import {
  AddIcon,
  Button,
  Column,
  FeeTier,
  Flex,
  IconButton,
  MinusIcon,
  Row,
  Skeleton,
  SortArrow,
  Tag,
  Text,
  useModalV2,
} from '@pancakeswap/uikit'
import { Protocol } from '@pancakeswap/farms'
import { ERC20Token } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Price, Token } from '@pancakeswap/swap-sdk-core'
import { unwrappedToken } from '@pancakeswap/tokens'
import { Bound, FiatNumberDisplay } from '@pancakeswap/widgets-internal'
import { RangeTag } from 'components/RangeTag'
import { TokenPairImage } from 'components/TokenImage'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import NextLink from 'next/link'
import { memo, useCallback, useMemo, useState } from 'react'
import { getPoolAddressByToken, useExtraV3PositionInfo, usePoolInfo } from 'state/farmsV4/hooks'
import type { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { type PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { useTheme } from '@pancakeswap/hooks'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import useFarmV3Actions from 'views/Farms/hooks/v3/useFarmV3Actions'
import { AddLiquidityV3Modal } from 'views/AddLiquidityV3/Modal'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { useCakePrice } from 'hooks/useCakePrice'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { PoolApyButton } from './PoolApyButton'
import { StakeModal } from './StakeModal'

const Container = styled(Flex)`
  min-width: 576px;
  padding: 16px;
  align-items: flex-start;
  position: relative;
  gap: 12px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom-width: 2px;
  background: ${({ theme }) => theme.card.background};
  margin: 8px 0;
`

const DetailsContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const TagCell = styled(Flex)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
`

interface IPriceRangeProps {
  currency0: Currency
  currency1: Currency
  priceUpper?: Price<Token, Token>
  priceLower?: Price<Token, Token>
  tickAtLimit: {
    LOWER?: boolean
    UPPER?: boolean
  }
}

const useTotalPriceUSD = ({
  currency0,
  currency1,
  amount0,
  amount1,
}: {
  currency0: Currency | null | undefined
  currency1: Currency | null | undefined
  amount0?: CurrencyAmount<ERC20Token>
  amount1?: CurrencyAmount<ERC20Token>
}) => {
  const { data: currency0PriceFromApi } = useCurrencyUsdPrice(currency0, {
    enabled: !!currency0,
  })
  const { data: currency1PriceFromApi } = useCurrencyUsdPrice(currency1, {
    enabled: !!currency1,
  })
  return useMemo(() => {
    return (
      Number(currency0PriceFromApi) * Number(amount0 ? amount0.toExact() : 0) +
      Number(currency1PriceFromApi) * Number(amount1 ? amount1.toExact() : 0)
    )
  }, [amount0, amount1, currency0PriceFromApi, currency1PriceFromApi])
}

const PriceRange = memo(({ currency1, currency0, priceLower, priceUpper, tickAtLimit }: IPriceRangeProps) => {
  const [priceBaseInvert, setPriceBaseInvert] = useState(false)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const toggleSwitch: React.MouseEventHandler<HTMLOrSVGElement> = useCallback(
    (e) => {
      e.preventDefault()
      setPriceBaseInvert(!priceBaseInvert)
    },
    [priceBaseInvert],
  )

  return priceUpper && priceLower ? (
    <>
      {t('Min %minAmount%', {
        minAmount: formatTickPrice(
          priceBaseInvert ? priceUpper.invert() : priceLower,
          tickAtLimit,
          Bound.LOWER,
          locale,
        ),
      })}{' '}
      /{' '}
      {t('Max %maxAmount%', {
        maxAmount: formatTickPrice(
          priceBaseInvert ? priceLower.invert() : priceUpper,
          tickAtLimit,
          Bound.UPPER,
          locale,
        ),
      })}{' '}
      {t('of %assetA% per %assetB%', {
        assetA: priceBaseInvert ? currency1.symbol : currency0.symbol,
        assetB: priceBaseInvert ? currency0.symbol : currency1.symbol,
      })}
      <SortArrow
        color="textSubtle"
        style={{ transform: 'rotate(90deg)', cursor: 'pointer' }}
        onClick={toggleSwitch}
        ml="4px"
      />
    </>
  ) : null
})

export const PositionV2Item = memo(({ data }: { data: V2LPDetail; pool?: PoolInfo }) => {
  const { pair, deposited0, deposited1 } = data

  const unwrappedToken0 = unwrappedToken(pair.token0)
  const unwrappedToken1 = unwrappedToken(pair.token1)
  const totalPriceUSD = useTotalPriceUSD({
    currency0: unwrappedToken0,
    currency1: unwrappedToken1,
    amount0: deposited0,
    amount1: deposited1,
  })

  return (
    <PositionItemDetail
      chainId={data.pair.chainId}
      totalPriceUSD={totalPriceUSD}
      currency0={unwrappedToken0}
      currency1={unwrappedToken1}
      removed={false}
      outOfRange={false}
      protocol={data.protocol}
      // todo:@eric
      fee={200}
      amount0={deposited0}
      amount1={deposited1}
    />
  )
})

export const PositionStableItem = memo(({ data }: { data: StableLPDetail; pool?: PoolInfo }) => {
  const { pair, deposited0, deposited1 } = data

  const totalPriceUSD = useTotalPriceUSD({
    currency0: pair.token0,
    currency1: pair.token1,
    amount0: deposited0,
    amount1: deposited1,
  })

  return (
    <PositionItemDetail
      chainId={data.pair.token1.chainId}
      totalPriceUSD={totalPriceUSD}
      currency0={pair.token0}
      currency1={pair.token1}
      removed={false}
      outOfRange={false}
      protocol={data.protocol}
      fee={Number(pair.fee.numerator)}
      amount0={deposited0}
      amount1={deposited1}
    />
  )
})
interface IPositionV3ItemProps {
  data: PositionDetail
  poolInfo?: PoolInfo
}

export const PositionV3Item = memo(({ data }: IPositionV3ItemProps) => {
  const { currency0, currency1, removed, outOfRange, priceUpper, priceLower, tickAtLimit, position } =
    useExtraV3PositionInfo(data)

  const poolAddress = getPoolAddressByToken(data.chainId, data.token0, data.token1, data.fee)
  const pool = usePoolInfo({ poolAddress, chainId: data.chainId })

  const totalPriceUSD = useTotalPriceUSD({
    currency0,
    currency1,
    amount0: position?.amount0,
    amount1: position?.amount1,
  })

  const desc =
    currency1 && currency0 ? (
      <PriceRange
        currency0={currency0}
        currency1={currency1}
        priceLower={priceLower}
        priceUpper={priceUpper}
        tickAtLimit={tickAtLimit}
      />
    ) : null

  return (
    <PositionItemDetail
      chainId={data.chainId}
      link={`/liquidity/${data.tokenId}`}
      pool={pool}
      totalPriceUSD={totalPriceUSD}
      amount0={position?.amount0}
      amount1={position?.amount1}
      desc={desc}
      currency0={currency0}
      currency1={currency1}
      removed={removed}
      outOfRange={outOfRange}
      fee={data.fee}
      protocol={data.protocol}
      isStaked={data.isStaked}
      tokenId={data.tokenId}
    />
  )
})

const DetailInfoTitle = styled.div`
  display: flex;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
`

const DetailInfoDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
`

const DetailInfoLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-weight: 600;
  font-size: 12px;
`

interface IPositionItemDetailProps {
  chainId: number
  currency0?: Currency
  currency1?: Currency
  removed: boolean
  outOfRange: boolean
  desc?: React.ReactNode
  link?: string
  tokenId?: bigint
  fee: number
  isStaked?: boolean
  protocol: Protocol
  totalPriceUSD: number
  amount0?: CurrencyAmount<Token>
  amount1?: CurrencyAmount<Token>
  pool?: PoolInfo | null
  detailMode?: boolean
}

export const PositionItemSkeleton = () => {
  return (
    <Container>
      <Skeleton width={48} height={48} variant="circle" />
      <div>
        <Skeleton width={40} height={10} mb="4px" />
        <Skeleton width={60} height={24} />
      </div>
    </Container>
  )
}

export const PositionItemDetail = ({
  link,
  currency0,
  currency1,
  removed,
  outOfRange,
  desc,
  tokenId,
  fee,
  isStaked,
  protocol,
  totalPriceUSD,
  amount0,
  amount1,
  pool,
  detailMode,
}: IPositionItemDetailProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const cakePrice = useCakePrice()
  const stackedTokenId = useMemo(() => (tokenId ? [tokenId] : []), [tokenId])
  const {
    tokenIdResults: [pendingCake],
  } = useStakedPositionsByUser(stackedTokenId)
  const earningsAmount = useMemo(() => +formatBigInt(pendingCake || 0n, 4), [pendingCake])
  const earningsBusd = useMemo(() => {
    return new BigNumber(earningsAmount).times(cakePrice.toString()).toNumber()
  }, [cakePrice, earningsAmount])

  if (!(currency0 && currency1)) {
    return <PositionItemSkeleton />
  }

  const detailInfo = (
    <>
      <DetailInfoTitle>
        <Text bold>{`${currency0.symbol} / ${currency1.symbol} LP`}</Text>
        {tokenId ? <Text color="textSubtle">(#{tokenId.toString()})</Text> : null}
        <FeeTier type={protocol} fee={fee} />
        <TagCell>
          {isStaked && (
            <Tag variant="primary60" mr="8px">
              {t('Farming')}
            </Tag>
          )}
          {protocol === Protocol.V3 && <RangeTag lowContrast removed={removed} outOfRange={outOfRange} />}
        </TagCell>
      </DetailInfoTitle>
      <DetailInfoDesc>
        <Row>{desc}</Row>
        <Row gap="sm">
          <FiatNumberDisplay
            prefix="~"
            value={totalPriceUSD}
            style={{ color: theme.colors.textSubtle, fontSize: '12px' }}
            showFullDigitsTooltip={false}
          />
          ({amount0 ? amount0.toFixed(6) : 0} {currency0?.symbol ?? '-'} / {amount1 ? amount1.toFixed(6) : 0}{' '}
          {currency1?.symbol ?? '-'})
        </Row>
        <Row gap="8px">
          <DetailInfoLabel>APR: </DetailInfoLabel>
          {pool ? <PoolApyButton pool={pool} /> : <Skeleton width={60} />}
        </Row>
        {earningsAmount > 0 && (
          <Row gap="8px">
            <DetailInfoLabel>
              {t('CAKE earned')}: {earningsAmount} (~${earningsBusd})
            </DetailInfoLabel>
          </Row>
        )}
      </DetailInfoDesc>
    </>
  )

  const content = (
    <Container>
      <TokenPairImage
        width={48}
        height={48}
        variant="inverted"
        primaryToken={currency0}
        secondaryToken={currency1.wrapped}
      />
      <DetailsContainer>
        <Column gap="8px">{detailInfo}</Column>
        <Column justifyContent="flex-end">
          <ActionPanel
            currency0={currency0}
            currency1={currency1}
            isStaked={isStaked}
            removed={removed}
            tokenId={tokenId}
            outOfRange={outOfRange}
            modalContent={detailInfo}
            detailMode={detailMode}
          />
        </Column>
      </DetailsContainer>
    </Container>
  )

  if (!link) {
    return content
  }
  return <NextLink href={link}>{content}</NextLink>
}

const ActionPanelContainer = styled(Flex)`
  flex-direction: row;
  gap: 8px;
  height: 48px;
`

interface IActionPanelProps {
  removed: boolean
  outOfRange: boolean
  tokenId?: bigint
  isStaked?: boolean
  detailMode?: boolean
  modalContent: React.ReactNode
  currency0: Currency
  currency1: Currency
}
const ActionPanel = ({
  currency0,
  currency1,
  isStaked,
  removed,
  outOfRange,
  tokenId,
  modalContent,
  detailMode,
}: IActionPanelProps) => {
  const { t } = useTranslation()
  const { onStake, onUnstake, onHarvest, attemptingTxn } = useFarmV3Actions({
    tokenId: tokenId?.toString() ?? '',
    onDone: () => {},
  })
  const stakeModal = useModalV2()
  const addLiquidityModal = useModalV2()

  const handleStakeAndCheckInactive = useCallback(async () => {
    logGTMClickStakeFarmEvent()
    if (outOfRange && !isStaked) {
      stakeModal.onOpen()
    } else {
      await onStake()
    }
  }, [isStaked, onStake, outOfRange, stakeModal])

  const handleStake = useCallback(async () => {
    logGTMClickStakeFarmEvent()
    await onStake()
  }, [onStake])

  const preventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  const stakeButton = useMemo(
    () => (
      <>
        <Button scale="md" width={['100px']} style={{ alignSelf: 'center' }} onClick={handleStakeAndCheckInactive}>
          {t('Stake')}
        </Button>
        <StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onStake={handleStake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </StakeModal>
      </>
    ),
    [handleStake, handleStakeAndCheckInactive, isStaked, modalContent, t, outOfRange, stakeModal],
  )

  const unstakeButton = useMemo(
    () => (
      <>
        <Button
          scale="md"
          width={['100px']}
          style={{ alignSelf: 'center' }}
          variant="secondary"
          onClick={stakeModal.onOpen}
        >
          {t('Unstake')}
        </Button>
        <StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onUnStake={onUnstake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </StakeModal>
      </>
    ),
    [onUnstake, isStaked, modalContent, t, outOfRange, stakeModal],
  )

  const addLiquidityButton = useMemo(
    () => (
      <>
        <IconButton variant="secondary" onClick={addLiquidityModal.onOpen}>
          <AddIcon color="primary" width="14px" />
        </IconButton>
        <AddLiquidityV3Modal {...addLiquidityModal} currency0={currency0} currency1={currency1} />
      </>
    ),
    [addLiquidityModal, currency0, currency1],
  )

  if (detailMode) {
    return (
      <ActionPanelContainer onClick={preventDefault}>
        {!removed && (
          <IconButton mr="6px" variant="secondary" onClick={() => {}}>
            <MinusIcon color="primary" width="14px" />
          </IconButton>
        )}
        {addLiquidityButton}
        {isStaked ? unstakeButton : !removed ? stakeButton : null}
      </ActionPanelContainer>
    )
  }
  return (
    <ActionPanelContainer onClick={preventDefault}>
      {!isStaked && !removed ? stakeButton : null}
      {isStaked && !removed ? (
        <Button width={['100px']} scale="md" disabled={attemptingTxn} onClick={onHarvest}>
          {attemptingTxn ? t('Harvesting') : t('Harvest')}
        </Button>
      ) : null}
    </ActionPanelContainer>
  )
}
