import { BigNumber } from '@ethersproject/bignumber'
// import useLocalSelector from 'contexts/LocalRedux/useSelector'
// import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
// import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'

export default function AddLiquidityV3({ currencyA, currencyB }) {
  const tokenId = null

  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined,
  )
  const hasExistingPosition = !!existingPositionDetails && !positionLoading

  // const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

  // mint state
  // const { independentField, typedValue, startPriceTypedValue, rightRangeTypedValue, leftRangeTypedValue } =
  //   useLocalSelector((s) => s)

  // const {
  //   pool,
  //   ticks,
  //   dependentField,
  //   price,
  //   pricesAtTicks,
  //   parsedAmounts,
  //   currencyBalances,
  //   position,
  //   noLiquidity,
  //   currencies,
  //   errorMessage,
  //   invalidPool,
  //   invalidRange,
  //   outOfRange,
  //   depositADisabled,
  //   depositBDisabled,
  //   invertPrice,
  //   ticksAtLimit,
  // } = useV3DerivedInfo(
  //   baseCurrency ?? undefined,
  //   quoteCurrency ?? undefined,
  //   feeAmount,
  //   baseCurrency ?? undefined,
  //   existingPosition,
  // )

  return hasExistingPosition ? <>v3 increase</> : <>v3 add</>
}
