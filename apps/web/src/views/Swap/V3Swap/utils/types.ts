import { ChainId, CurrencyAmount, TradeType, Currency, NativeCurrency, Native, Token, Route as V2Route, Pair, Percent, Fraction, ONE} from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/dist/evm/index'
import { Route as V3Route, Pool as PoolV3, TradeV3, MixedRouteSDK } from '@pancakeswap/v3-sdk'

export type InterfaceTrade = ClassicTrade

export enum QuoteState {
  SUCCESS = 'Success',
  NOT_FOUND = 'Not found',
}

export type QuoteResult =
  | {
      state: QuoteState.NOT_FOUND
      data?: undefined
    }
  | {
      state: QuoteState.SUCCESS
      data: SmartRouterTrade<TradeType>
    }

export type TradeResult =
  | {
      state: QuoteState.NOT_FOUND
      trade?: undefined
      latencyMs?: number
    }
  | {
      state: QuoteState.SUCCESS
      trade: InterfaceTrade
      latencyMs?: number
    }

    export class ClassicTrade extends TradeV3<Currency, Currency, TradeType> {
      public readonly fillType = 'classic'

      // approveInfo: ApproveInfo
      gasUseEstimateUSD?: number // gas estimate for swaps

      gasUseEstimate?: number

      blockNumber: string | null | undefined

      // isUniswapXBetter: boolean | undefined
      // requestId: string | undefined
      // quoteMethod: QuoteMethod
      inputTax: Percent

      outputTax: Percent
    
      constructor({
        gasUseEstimateUSD,
        gasUseEstimate,
        blockNumber,
        inputTax,
        outputTax,
        ...routes
      }: {
        gasUseEstimateUSD?: number
        gasUseEstimate?: number
        totalGasUseEstimateUSD?: number
        blockNumber?: string | null
      //   quoteMethod: QuoteMethod
      //   approveInfo: ApproveInfo
        inputTax: Percent
        outputTax: Percent
        v2Routes: {
          routev2: V2Route<Currency, Currency>
          inputAmount: CurrencyAmount<Currency>
          outputAmount: CurrencyAmount<Currency>
        }[]
        v3Routes: {
          routev3: V3Route<Currency, Currency>
          inputAmount: CurrencyAmount<Currency>
          outputAmount: CurrencyAmount<Currency>
        }[]
        tradeType: TradeType
        mixedRoutes?: {
          mixedRoute:  MixedRouteSDK<Currency, Currency>
          inputAmount: CurrencyAmount<Currency>
          outputAmount: CurrencyAmount<Currency>
        }[]
      }) {
        super(routes)
        this.blockNumber = blockNumber
        this.gasUseEstimateUSD = gasUseEstimateUSD
        this.gasUseEstimate = gasUseEstimate
        this.inputTax = inputTax
        this.outputTax = outputTax
      }
    
      public get totalTaxRate(): Percent {
        return this.inputTax.add(this.outputTax)
      }
    
      public get postTaxOutputAmount() {
        // Ideally we should calculate the final output amount by ammending the inputAmount based on the input tax and then applying the output tax,
        // but this isn't currently possible because V2Trade reconstructs the total inputAmount based on the swap routes
        // TODO(WEB-2761): Amend V2Trade objects in the v2-sdk to have a separate field for post-input tax routes
        return this.outputAmount.multiply(new Fraction(ONE).subtract(this.totalTaxRate))
      }
    
      public minimumAmountOut(slippageTolerance: Percent, amountOut = this.outputAmount): CurrencyAmount<Currency> {
        // Since universal-router-sdk reconstructs V2Trade objects, overriding this method does not actually change the minimumAmountOut that gets submitted on-chain
        // Our current workaround is to add tax rate to slippage tolerance before we submit the trade to universal-router-sdk in useUniversalRouter.ts
        // So the purpose of this override is so the UI displays the same minimum amount out as what is submitted on-chain
        return super.minimumAmountOut(slippageTolerance.add(this.totalTaxRate), amountOut)
      }
    
      // gas estimate for maybe approve + swap
      public get totalGasUseEstimateUSD(): number | undefined {
        // if (this.approveInfo.needsApprove && this.gasUseEstimateUSD) {
        //   return this.approveInfo.approveGasEstimateUSD + this.gasUseEstimateUSD
        // }
    
        return this.gasUseEstimateUSD
      }
    }