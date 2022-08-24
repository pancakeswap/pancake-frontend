import { useTranslation } from '@pancakeswap/localization'
import { CardBody, Message, Text, AddIcon } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoColumn, ColumnCenter } from 'components/Layout/Column'
import { CommonBasesType } from 'components/SearchModal/types'
import Page from 'views/Page'
import _noop from 'lodash/noop'
import { CommitButton } from 'components/CommitButton'
import { RowBetween } from 'components/Layout/Row'
import { useRouter } from 'next/router'
import { useCurrency } from 'hooks/Tokens'
import { Field, resetMintState } from 'state/mint/actions'
import { useAppDispatch } from 'state'
import { useEffect, useMemo } from 'react'
import { CAKE, USDC } from 'config/constants/tokens'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useCurrencySelectRoute } from 'views/AddLiquidity/useCurrencySelectRoute'

// const NoLiquidity = () => {
//   const { t } = useTranslation()

//   return (
//     <Message variant="warning">
//       <div>
//         <Text bold mb="8px">
//           {t('You are the first liquidity provider.')}
//         </Text>
//         <Text mb="8px">{t('The ratio of tokens you add will set the price of this pool.')}</Text>
//         <Text>{t('Once you are happy with the rate click supply to review.')}</Text>
//       </div>
//     </Message>
//   )
// }

export default function AddStableLiquidity() {
  // Duplidate AddLiquidity
  const router = useRouter()
  const { account, chainId, isWrongNetwork } = useActiveWeb3React()
  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    CAKE[chainId]?.address ?? USDC[chainId]?.address,
  ]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  const { t } = useTranslation()

  // settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts: mintParsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  // input handlers
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: independentField === Field.CURRENCY_B && typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : mintParsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, noLiquidity, otherTypedValue, mintParsedAmounts, typedValue],
  )

  return (
    <Page>
      <AppBody>
        <AppHeader
          title={t('Add Stable Liquidity')}
          subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
          helper={t(
            'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.',
          )}
          backTo="/liquidity"
        />
        <CardBody>
          <AutoColumn gap="20px">
            {/* <ColumnCenter>
              <NoLiquidity />
            </ColumnCenter> */}
            <CurrencyInputPanel
              showBUSD
              onCurrencySelect={handleCurrencyASelect}
              zapStyle="noZap"
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldAInput}
              onMax={_noop}
              showMaxButton={false}
              id="add-stable-liquidity-input-tokena"
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
              currency={currencies[Field.CURRENCY_B]}
            />
          </AutoColumn>
          <ColumnCenter>
            <AddIcon width="16px" />
          </ColumnCenter>
          <CurrencyInputPanel
            showBUSD
            onCurrencySelect={handleCurrencyBSelect}
            zapStyle="noZap"
            value={formattedAmounts[Field.CURRENCY_B]}
            onUserInput={onFieldBInput}
            onMax={_noop}
            showMaxButton={false}
            id="add-stable-liquidity-outpuy-tokena"
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
            currency={currencies[Field.CURRENCY_B]}
          />

          <RowBetween>
            <Text bold fontSize="12px" color="secondary">
              {t('Slippage Tolerance')}
            </Text>
            <Text bold color="primary">
              {allowedSlippage / 100}%
            </Text>
          </RowBetween>

          <AutoColumn gap="md">
            <CommitButton onClick={_noop} disabled={false}>
              {t('Supply')}
            </CommitButton>
          </AutoColumn>
        </CardBody>
      </AppBody>
    </Page>
  )
}
