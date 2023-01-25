// import { BigNumber } from '@ethersproject/bignumber'
// import { TransactionResponse } from '@ethersproject/providers'
// import { CurrencyAmount, Percent } from '@pancakeswap/sdk'
// import { NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import { useV3NFTPositionManagerContract } from 'hooks/useContract'
// import useTransactionDeadline from 'hooks/useTransactionDeadline'
// import { useDerivedV3BurnInfo } from 'hooks/v3/useDerivedV3BurnInfo'
// import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
// import { useCallback, useMemo, useState } from 'react'
// import { Navigate, useLocation, useParams } from 'react-router-dom'
// import { useTransactionAdder } from 'state/transactions/hooks'
// import { useUserSlippageTolerance } from 'state/user/hooks'
// import { calculateGasMargin } from 'utils'
// import currencyId from 'utils/currencyId'

// // redirect invalid tokenIds
// export default function RemoveLiquidityV3() {
//   const { tokenId } = useParams<{ tokenId: string }>()
//   const location = useLocation()
//   const parsedTokenId = useMemo(() => {
//     try {
//       return BigNumber.from(tokenId)
//     } catch {
//       return null
//     }
//   }, [tokenId])

//   if (parsedTokenId === null || parsedTokenId.eq(0)) {
//     return <Navigate to={{ ...location, pathname: '/pool' }} replace />
//   }

//   return <Remove tokenId={parsedTokenId} />
// }

// function Remove({ tokenId }: { tokenId: BigNumber }) {
//   // const { percent } = useBurnV3State()
//   const { account, chainId, provider } = useActiveWeb3React()
//   const addTransaction = useTransactionAdder()

//   const percent = 0
//   const { position } = useV3PositionFromTokenId(tokenId)

//   const {
//     position: positionSDK,
//     liquidityPercentage,
//     liquidityValue0,
//     liquidityValue1,
//     feeValue0,
//     feeValue1,
//     outOfRange,
//     error,
//   } = useDerivedV3BurnInfo(position, percent)

//   const [allowedSlippage] = useUserSlippageTolerance() // custom from users
//   // const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

//   const deadline = useTransactionDeadline() // custom from users settings
//   const [attemptingTxn, setAttemptingTxn] = useState(false)
//   const [txnHash, setTxnHash] = useState<string | undefined>()

//   const positionManager = useV3NFTPositionManagerContract()

//   const burn = useCallback(async () => {
//     setAttemptingTxn(true)
//     if (
//       !positionManager ||
//       !liquidityValue0 ||
//       !liquidityValue1 ||
//       !deadline ||
//       !account ||
//       !chainId ||
//       !positionSDK ||
//       !liquidityPercentage ||
//       !provider
//     ) {
//       return
//     }

//     // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
//     // vast majority of cases
//     const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
//       tokenId: tokenId.toString(),
//       liquidityPercentage,
//       slippageTolerance: new Percent(allowedSlippage, 100),
//       deadline: deadline.toString(),
//       collectOptions: {
//         expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0),
//         expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0),
//         recipient: account,
//       },
//     })

//     const txn = {
//       to: positionManager.address,
//       data: calldata,
//       value,
//     }

//     provider
//       .getSigner()
//       .estimateGas(txn)
//       .then((estimate) => {
//         const newTxn = {
//           ...txn,
//           gasLimit: calculateGasMargin(estimate),
//         }

//         return provider
//           .getSigner()
//           .sendTransaction(newTxn)
//           .then((response: TransactionResponse) => {
//             setTxnHash(response.hash)
//             setAttemptingTxn(false)
//             addTransaction(response, {
//               type: 'remove-liquidity-v3',
//               baseCurrencyId: currencyId(liquidityValue0.currency),
//               quoteCurrencyId: currencyId(liquidityValue1.currency),
//               expectedAmountBaseRaw: liquidityValue0.quotient.toString(),
//               expectedAmountQuoteRaw: liquidityValue1.quotient.toString(),
//             })
//           })
//       })
//       .catch((err) => {
//         setAttemptingTxn(false)
//         console.error(err)
//       })
//   }, [
//     positionManager,
//     liquidityValue0,
//     liquidityValue1,
//     deadline,
//     account,
//     chainId,
//     feeValue0,
//     feeValue1,
//     positionSDK,
//     liquidityPercentage,
//     provider,
//     tokenId,
//     allowedSlippage,
//     addTransaction,
//   ])

//   return <h1>Remove</h1>
// }
