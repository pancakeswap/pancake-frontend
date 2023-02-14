import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount, Percent, WNATIVE } from '@pancakeswap/sdk'
import {
  AutoRow,
  CardBody,
  Heading,
  Flex,
  Tag,
  Slider,
  Button,
  Text,
  ColumnCenter,
  ArrowDownIcon,
  AutoColumn,
  useModal,
  ConfirmationModalContent,
  RowBetween,
  RowFixed,
  Toggle,
} from '@pancakeswap/uikit'
import { NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
import { AppBody, AppHeader } from 'components/App'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useDerivedV3BurnInfo } from 'hooks/v3/useDerivedV3BurnInfo'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin } from 'utils'
import currencyId from 'utils/currencyId'
import Page from 'views/Page'
import { useSigner } from 'wagmi'
import useLocalSelector from 'contexts/LocalRedux/useSelector'
import styled from 'styled-components'
import { useDebouncedChangeHandler } from '@pancakeswap/hooks'
import { LightGreyCard } from 'components/Card'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import FormattedCurrencyAmount from 'components/Chart/FormattedCurrencyAmount/FormattedCurrencyAmount'
import useNativeCurrency from 'hooks/useNativeCurrency'

import { useBurnV3ActionHandlers } from './form/hooks'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`

// redirect invalid tokenIds
export default function RemoveLiquidityV3() {
  const router = useRouter()

  const [tokenId] = router.query.tokenId || []

  const parsedTokenId = useMemo(() => {
    try {
      return BigNumber.from(tokenId)
    } catch {
      return null
    }
  }, [tokenId])

  return <Remove tokenId={parsedTokenId} />
}

function Remove({ tokenId }: { tokenId: BigNumber }) {
  const { t } = useTranslation()

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency()
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  const { percent } = useLocalSelector<{ percent: number }>((s) => s) as { percent: number }

  const { account, chainId } = useActiveWeb3React()
  const { data: signer } = useSigner()
  const addTransaction = useTransactionAdder()

  const { position } = useV3PositionFromTokenId(tokenId)

  const {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  } = useDerivedV3BurnInfo(position, percent, receiveWETH)

  const { onPercentSelect } = useBurnV3ActionHandlers()

  // boilerplate for the slider
  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onPercentSelect)

  const handleChangePercent = useCallback(
    (value) => onPercentSelectForSlider(Math.ceil(value)),
    [onPercentSelectForSlider],
  )

  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  // const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE) // custom from users

  const deadline = useTransactionDeadline() // custom from users settings
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txnHash, setTxnHash] = useState<string | undefined>()

  const positionManager = useV3NFTPositionManagerContract()

  const onRemove = useCallback(async () => {
    setAttemptingTxn(true)
    if (
      !positionManager ||
      !liquidityValue0 ||
      !liquidityValue1 ||
      !deadline ||
      !account ||
      !chainId ||
      !positionSDK ||
      !liquidityPercentage ||
      !signer
    ) {
      return
    }

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
      tokenId: tokenId.toString(),
      liquidityPercentage,
      slippageTolerance: new Percent(allowedSlippage, 100),
      deadline: deadline.toString(),
      collectOptions: {
        expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(liquidityValue0.currency, 0),
        expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(liquidityValue1.currency, 0),
        recipient: account,
      },
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value,
    }

    signer
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return signer.sendTransaction(newTxn).then((response: TransactionResponse) => {
          // setTxnHash(response.hash)
          setAttemptingTxn(false)
          addTransaction(response, {
            type: 'remove-liquidity-v3',
            baseCurrencyId: currencyId(liquidityValue0.currency),
            quoteCurrencyId: currencyId(liquidityValue1.currency),
            expectedAmountBaseRaw: liquidityValue0.quotient.toString(),
            expectedAmountQuoteRaw: liquidityValue1.quotient.toString(),
          })
        })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [
    positionManager,
    liquidityValue0,
    liquidityValue1,
    deadline,
    account,
    chainId,
    feeValue0,
    feeValue1,
    positionSDK,
    liquidityPercentage,
    signer,
    tokenId,
    allowedSlippage,
    addTransaction,
  ])

  const removed = position?.liquidity?.eq(0)

  function modalHeader() {
    return (
      <>
        <RowBetween alignItems="flex-end">
          <Text fontSize={16} fontWeight={500}>
            Pooled {liquidityValue0?.currency?.symbol}:
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={500} marginLeft="6px">
              {liquidityValue0 && <FormattedCurrencyAmount currencyAmount={liquidityValue0} />}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue0?.currency} />
          </RowFixed>
        </RowBetween>
        <RowBetween alignItems="flex-end">
          <Text fontSize={16} fontWeight={500}>
            Pooled {liquidityValue1?.currency?.symbol}:
          </Text>
          <RowFixed>
            <Text fontSize={16} fontWeight={500} marginLeft="6px">
              {liquidityValue1 && <FormattedCurrencyAmount currencyAmount={liquidityValue1} />}
            </Text>
            <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={liquidityValue1?.currency} />
          </RowFixed>
        </RowBetween>
        {feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) ? (
          <>
            <Text fontSize={12} textAlign="left" padding="8px 0 0 0">
              You will also collect fees earned from this position.
            </Text>
            <RowBetween>
              <Text fontSize={16} fontWeight={500}>
                {feeValue0?.currency?.symbol} Fees Earned:
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft="6px">
                  {feeValue0 && <FormattedCurrencyAmount currencyAmount={feeValue0} />}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue0?.currency} />
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={16} fontWeight={500}>
                {feeValue1?.currency?.symbol} Fees Earned:
              </Text>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} marginLeft="6px">
                  {feeValue1 && <FormattedCurrencyAmount currencyAmount={feeValue1} />}
                </Text>
                <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={feeValue1?.currency} />
              </RowFixed>
            </RowBetween>
          </>
        ) : null}
      </>
    )
  }

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txnHash) {
      onPercentSelectForSlider(0)
    }
    setAttemptingTxn(false)
    setTxnHash('')
  }, [onPercentSelectForSlider, txnHash])

  const [onPresentRemoveLiquidityModal] = useModal(
    <TransactionConfirmationModal
      title="Remove Liquidity"
      onDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txnHash ?? ''}
      content={() => (
        <ConfirmationModalContent
          topContent={modalHeader}
          bottomContent={() => (
            <Button width="100%" mt="16px" onClick={onRemove}>
              Remove
            </Button>
          )}
        />
      )}
      pendingText={`Removing ${liquidityValue0?.toSignificant(6)} ${liquidityValue0?.currency?.symbol} and 
      ${liquidityValue1?.toSignificant(6)} ${liquidityValue1?.currency?.symbol}`}
    />,
    true,
    true,
    'TransactionConfirmationModalRemoveLiquidity',
  )

  const showCollectAsWeth = Boolean(
    liquidityValue0?.currency &&
      liquidityValue1?.currency &&
      (liquidityValue0.currency.isNative ||
        liquidityValue1.currency.isNative ||
        WNATIVE[liquidityValue0.currency.chainId]?.equals(liquidityValue0.currency.wrapped) ||
        WNATIVE[liquidityValue1.currency.chainId]?.equals(liquidityValue1.currency.wrapped)),
  )

  return (
    <Page>
      <AppBody>
        <AppHeader
          backTo={`/pool-v3/${tokenId}`}
          title={t('Remove %assetA%-%assetB% liquidity', {
            assetA: liquidityValue0?.currency?.symbol ?? '',
            assetB: liquidityValue1?.currency?.symbol ?? '',
          })}
          noConfig
        />
        <CardBody>
          <AutoRow justifyContent="space-between" mb="24px">
            <Flex>
              <DoubleCurrencyLogo
                size={24}
                currency0={liquidityValue0?.currency}
                currency1={liquidityValue1?.currency}
              />
              <Heading ml="8px" as="h2">
                {liquidityValue0?.currency?.symbol} - {liquidityValue1?.currency?.symbol} LP
              </Heading>
            </Flex>

            {outOfRange ? (
              <Tag ml="8px" variant="textSubtle" outline>
                Out of range
              </Tag>
            ) : (
              <Tag ml="8px" variant="success" outline>
                In range
              </Tag>
            )}
          </AutoRow>
          <Text mb="16px">Amount</Text>
          <BorderCard style={{ padding: '16px' }}>
            <Text fontSize="40px" bold mb="16px" style={{ lineHeight: 1 }}>
              {percentForSlider}%
            </Text>
            <Slider
              name="lp-amount"
              min={0}
              max={100}
              value={percentForSlider}
              onValueChanged={handleChangePercent}
              mb="16px"
            />
            <Flex flexWrap="wrap" justifyContent="space-evenly">
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(25)}>
                25%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(50)}>
                50%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(75)}>
                75%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onPercentSelect(100)}>
                {t('Max')}
              </Button>
            </Flex>
          </BorderCard>
          <ColumnCenter>
            <ArrowDownIcon color="textSubtle" width="24px" my="16px" />
          </ColumnCenter>
          <AutoColumn gap="8px" mb="32px">
            <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
              {t('Receive')}
            </Text>
            <LightGreyCard>
              <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={liquidityValue0?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                    Pooled {liquidityValue0?.currency?.symbol}
                  </Text>
                </Flex>
                <Flex>
                  <Text small bold>
                    {liquidityValue0?.toSignificant(6) || '0'}
                  </Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" as="label" alignItems="center" mb="16px">
                <Flex alignItems="center">
                  <CurrencyLogo currency={liquidityValue1?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                    Pooled {liquidityValue1?.currency?.symbol}
                  </Text>
                </Flex>
                <Flex>
                  <Text small bold>
                    {liquidityValue1?.toSignificant(6) || '0'}
                  </Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={feeValue0?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                    {feeValue0?.currency?.symbol} Fee Earned
                  </Text>
                </Flex>
                <Flex>
                  <Text small bold>
                    {feeValue0?.toSignificant(6) || '0'}
                  </Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={feeValue1?.currency} />
                  <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                    {feeValue1?.currency?.symbol} Fee Earned
                  </Text>
                </Flex>
                <Flex>
                  <Text small bold>
                    {feeValue1?.toSignificant(6) || '0'}
                  </Text>
                </Flex>
              </Flex>
            </LightGreyCard>
          </AutoColumn>
          {showCollectAsWeth && (
            <Flex mb="8px">
              <Flex ml="auto" alignItems="center">
                <Text mr="8px">Collect as {nativeWrappedSymbol}</Text>
                <Toggle
                  id="receive-as-weth"
                  checked={receiveWETH}
                  onChange={() => setReceiveWETH((prevState) => !prevState)}
                />
              </Flex>
            </Flex>
          )}
          <Button
            disabled={attemptingTxn || removed || Boolean(error)}
            width="100%"
            onClick={onPresentRemoveLiquidityModal}
          >
            {removed ? 'Closed' : error ?? 'Remove'}
          </Button>
        </CardBody>
      </AppBody>
    </Page>
  )
}
