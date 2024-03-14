import { PositionDetails } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/swap-sdk-core'
import {
  AutoRow,
  Balance,
  Box,
  Button,
  ChevronRightIcon,
  Link,
  QuestionHelper,
  RowBetween,
  SyncAltIcon,
  Text,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { RangeTag } from 'components/RangeTag'
import { Bound } from 'config/constants/types'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { V3Farm } from 'views/Farms/FarmsV3'
import { FarmV3ApyButton } from './FarmV3ApyButton'

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: initial;
  }
`

type PositionType = 'staked' | 'unstaked'

interface FarmV3StakeAndUnStakeProps {
  farm: V3Farm
  title: string
  liquidityUrl: string
  position: PositionDetails
  outOfRange: boolean
  token: Token
  quoteToken: Token
  positionType: PositionType
  isPending: boolean
  handleStake: () => void
  handleUnStake: () => void
}

export const FarmV3LPTitle = ({
  liquidityUrl,
  title,
}: {
  liquidityUrl: string
  title: string
  outOfRange: boolean
}) => (
  <StyledLink href={liquidityUrl}>
    <Text bold>{title}</Text>
    <ChevronRightIcon fontSize="12px" />
  </StyledLink>
)

export const FarmV3LPPosition = ({
  position: position_,
  token,
  quoteToken,
}: {
  position: PositionDetails
  token: Token
  quoteToken: Token
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { position } = useDerivedPositionInfo(position_)
  const { tickLower, tickUpper, fee: feeAmount } = position_
  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)
  const [inverted, setInverted] = useState(false)

  const priceLower = useMemo(() => {
    if (!position) return undefined
    return token.equals(position.amount0.currency)
      ? inverted
        ? position.token0PriceLower
        : position.token0PriceUpper.invert()
      : inverted
      ? position.token0PriceUpper.invert()
      : position.token0PriceLower
  }, [position, inverted, token])
  const priceUpper = useMemo(() => {
    if (!position) return undefined
    return token.equals(position.amount1.currency)
      ? inverted
        ? position.token0PriceLower.invert()
        : position.token0PriceUpper
      : inverted
      ? position.token0PriceUpper
      : position.token0PriceLower.invert()
  }, [position, inverted, token])

  if (!position) return null

  return (
    <Box>
      <AutoRow gap="4px">
        <Box>
          <Text bold fontSize="12px" ellipsis>
            {t('Min %minAmount%', {
              minAmount: formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale),
            })}
          </Text>
        </Box>
        /
        <Box maxWidth="250px">
          <Text bold fontSize="12px" ellipsis>
            {t('Max %maxAmount%', {
              maxAmount: formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale),
            })}
          </Text>
        </Box>
        <Box>
          <Text bold fontSize="12px">
            {t('%assetA% per %assetB%', {
              assetA: inverted ? unwrappedToken(quoteToken)?.symbol : unwrappedToken(token)?.symbol,
              assetB: inverted ? unwrappedToken(token)?.symbol : unwrappedToken(quoteToken)?.symbol,
            })}
          </Text>
        </Box>
        <Box>
          <SyncAltIcon
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault()
              setInverted((s) => !s)
            }}
            width="12px"
            ml="4px"
            color="primary"
          />
        </Box>
      </AutoRow>
    </Box>
  )
}

export function FarmV3LPPositionDetail({
  position: position_,
  token,
  quoteToken,
  farm,
  positionType,
}: {
  position: PositionDetails
  token: Token
  quoteToken: Token
  farm: V3Farm
  positionType: PositionType
}) {
  const { t } = useTranslation()
  const { position } = useDerivedPositionInfo(position_)
  const isSorted = token.sortsBefore(quoteToken)
  const [amountA, amountB] = isSorted ? [position?.amount0, position?.amount1] : [position?.amount1, position?.amount0]

  const estimatedUSD =
    position &&
    amountA &&
    amountB &&
    new BigNumber(amountA.toExact())
      .multipliedBy(farm.tokenPriceBusd)
      .plus(new BigNumber(amountB.toExact()).multipliedBy(farm.quoteTokenPriceBusd))
      .toNumber()

  return (
    <Box>
      {position && (
        <AutoRow gap="2px" py="8px">
          <Text fontSize="14px">{t('APR')}:</Text>
          <FarmV3ApyButton
            farm={farm}
            existingPosition={position}
            tokenId={position_?.tokenId?.toString()}
            isPositionStaked={positionType === 'staked'}
          />
        </AutoRow>
      )}
      <Balance fontSize="12px" color="textSubtle" decimals={2} value={estimatedUSD ?? 0} unit=" USD" prefix="~" />
      <AutoRow columnGap="8px">
        <Balance
          fontSize="12px"
          color="textSubtle"
          decimals={2}
          value={position && amountA ? Number(amountA.toSignificant(6)) : 0}
          unit={` ${token.symbol}`}
          startFromValue
        />
        <Balance
          fontSize="12px"
          color="textSubtle"
          decimals={2}
          value={position && amountB ? Number(amountB.toSignificant(6)) : 0}
          unit={` ${quoteToken.symbol}`}
          startFromValue
        />
      </AutoRow>
    </Box>
  )
}

const FarmV3StakeAndUnStake: React.FunctionComponent<React.PropsWithChildren<FarmV3StakeAndUnStakeProps>> = ({
  farm,
  title,
  liquidityUrl,
  token,
  quoteToken,
  position,
  positionType,
  isPending,
  handleStake,
  handleUnStake,
  outOfRange,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {outOfRange && (
        <RangeTag outOfRange ml={0} style={{ alignItems: 'center' }}>
          {t('Inactive')}
          <QuestionHelper
            ml="4px"
            text={t('Inactive positions will NOT earn CAKE rewards from farm.')}
            size="20px"
            color="white"
            placement="bottom"
          />
        </RangeTag>
      )}
      <FarmV3LPTitle title={title} liquidityUrl={liquidityUrl} outOfRange={outOfRange} />
      <FarmV3LPPosition token={token} quoteToken={quoteToken} position={position} />
      <RowBetween gap="16px" flexWrap="wrap">
        <FarmV3LPPositionDetail
          farm={farm}
          token={token}
          quoteToken={quoteToken}
          position={position}
          positionType={positionType}
        />
        {positionType === 'unstaked' ? (
          <Button width={['120px']} style={{ alignSelf: 'center' }} disabled={isPending} onClick={handleStake}>
            {t('Stake')}
          </Button>
        ) : (
          <Button
            variant="secondary"
            width={['120px']}
            style={{ alignSelf: 'center' }}
            disabled={isPending}
            onClick={handleUnStake}
          >
            {t('Unstake')}
          </Button>
        )}
      </RowBetween>
    </>
  )
}

export default FarmV3StakeAndUnStake
