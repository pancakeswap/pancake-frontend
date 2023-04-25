import { useTranslation } from '@pancakeswap/localization'
import { CardBody, Text, RowBetween, Button, Box, useToast, Flex, Link } from '@pancakeswap/uikit'
import { AppBody, AppHeader } from 'components/App'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import Page from 'views/Page'
import { CHAIN_IDS } from 'utils/wagmi'
import { useCurrency } from 'hooks/Tokens'
import { LightGreyCard } from 'components/Card'
import { useRouter } from 'next/router'
import { useWBETHContract } from 'hooks/useContract'
import useETHApprovalStatus from 'hooks/useETHApprovalStatus'
import { useApproveETH } from 'hooks/useApproveETH'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCallback, useMemo, useState } from 'react'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { WETH9, NATIVE, ChainId } from '@pancakeswap/sdk'
import { useSWRContract } from 'hooks/useSWRContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { CurrencyLogo } from 'components/Logo'
import { ExchangeRateTitle } from 'views/LiquidStaking/components/ExchangeRateTitle'
import ConnectWalletButton from 'components/ConnectWalletButton'

// import { calculateGasMargin } from 'utils'

// Philip TODO: Validate routing only allow WETH BNB

const LiquidStakingStakePage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [stakeAmount, setStakeAmount] = useState('')
  // const [estimatedGas, setEstimatedGas] = useState()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading } = useCatchTxError()
  const { account, chainId } = useActiveWeb3React()

  const ethToken = chainId === ChainId.ETHEREUM ? NATIVE[chainId] : WETH9[chainId]

  const inputCurrency = useCurrency(ethToken?.address || ethToken?.symbol)

  const currencyBalance = useCurrencyBalance(account, inputCurrency)

  const currentAmount = stakeAmount ? new BigNumber(stakeAmount) : undefined

  const balance = useMemo(
    () => (currencyBalance ? new BigNumber(currencyBalance.quotient.toString()) : BIG_ZERO),
    [currencyBalance],
  )

  const convertedStakeAmount =
    currentAmount && inputCurrency ? getDecimalAmount(currentAmount, inputCurrency.decimals) : undefined

  const wbethContract = useWBETHContract()

  const { data } = useSWRContract(wbethContract && [wbethContract, 'exchangeRate'])

  const { isApproved } = useETHApprovalStatus(wbethContract?.address)

  const { isPending, onApprove } = useApproveETH(wbethContract?.address)

  const decimals = ethToken?.decimals

  const rateNumber: BigNumber | undefined = data
    ? new BigNumber(data.toString()).dividedBy(new BigNumber(10 ** decimals))
    : undefined

  const quoteAmount = currentAmount && rateNumber ? currentAmount.dividedBy(rateNumber.toString()) : undefined
  const exchangeRateAmount = rateNumber ? new BigNumber('1').dividedBy(rateNumber.toString()) : undefined

  // const estimateFn = useCallback(async () => {
  //   if (!convertedStakeAmount || !account) return

  //   const estimate = wbethContract.estimateGas.deposit
  //   const methodArgs = [convertedStakeAmount.toString(), account]

  //   let response

  //   try {
  //     response = await estimate(...methodArgs)
  //   } catch (err) {
  //     console.error(err)
  //   }

  //   if (response) setEstimatedGas(response)
  // }, [account, convertedStakeAmount, wbethContract.estimateGas.deposit])

  // useEffect(() => {
  //   // TODO: throttle
  //   estimateFn()
  // }, [estimateFn])

  const onStake = useCallback(async () => {
    if (!convertedStakeAmount || !account) return

    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [convertedStakeAmount.toString(), account]
      return callWithGasPrice(wbethContract, 'deposit', methodArgs, {
        // gasLimit: calculateGasMargin(estimatedGas),
      })
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {`${t('Received')} ${quoteAmount?.toString()} wBETH`}
        </ToastDescriptionWithTx>,
      )

      router.push('/liquid-staking')
    }
  }, [
    account,
    callWithGasPrice,
    convertedStakeAmount,
    fetchWithCatchTxError,
    quoteAmount,
    router,
    t,
    toastSuccess,
    wbethContract,
  ])

  let error = ''

  if (convertedStakeAmount?.isGreaterThan(balance)) {
    error = t('Insufficient Balance')
  }

  let button = null

  if (!account) {
    button = <ConnectWalletButton width="100%" />
  } else if (!isApproved) {
    button = (
      <Button
        isLoading={isPending}
        onClick={() => {
          onApprove()
        }}
        width="100%"
      >
        {t('Approve %symbol%', { symbol: inputCurrency?.symbol ?? '' })}
      </Button>
    )
  } else if (error) {
    button = (
      <Button disabled width="100%">
        {error}
      </Button>
    )
  } else if (isApproved && account) {
    button = (
      <Button isLoading={loading || !currentAmount?.isGreaterThan(0)} onClick={onStake} width="100%">
        {loading ? `${t('Staking')}...` : t('Stake')}
      </Button>
    )
  }

  return (
    <Page>
      <AppBody mb="24px">
        <AppHeader
          backTo="/liquid-staking"
          subtitle={t('Unlock liquidity while earning rewards')}
          title={t('Liquid Staking')}
          noConfig
        />
        <CardBody>
          <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
            {t('Deposit Amount')}
          </Text>
          <Box mb="16px">
            <CurrencyInputPanel
              showUSDPrice
              disableCurrencySelect
              value={stakeAmount}
              onUserInput={setStakeAmount}
              showQuickInputButton
              showMaxButton
              currency={inputCurrency}
              id="stake-liquidity-input-token"
              showCommonBases
            />
          </Box>
          <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
            {t('You will receive')}
          </Text>
          <LightGreyCard mb="16px" padding="8px 12px">
            <RowBetween>
              <Text>{quoteAmount && quoteAmount.isGreaterThan(0) ? getFullDisplayBalance(quoteAmount, 0) : '0'}</Text>
              <Flex>
                <CurrencyLogo currency={inputCurrency} size="24px" />
                <Text ml="4px">wBETH</Text>
              </Flex>
            </RowBetween>
          </LightGreyCard>
          <RowBetween mb="24px">
            <ExchangeRateTitle />

            {exchangeRateAmount ? <Text>{`1 ETH = ${getFullDisplayBalance(exchangeRateAmount, 0)} wBETH`}</Text> : '-'}
          </RowBetween>
          {/* 
          <RowBetween mb="24px">
            <Text color="textSubtle">Gas Fee</Text>-
          </RowBetween> */}

          {button}
        </CardBody>
      </AppBody>
      <AppBody>
        <Text padding="24px">
          We currently do not provide redemption services for wBETH to ETH. You can swap wBETH for ETH on{' '}
          <Link style={{ display: 'inline' }} href="/swap">
            our swap page{' '}
          </Link>
          instead. Alternatively, you can head to Binance.com to redeem ETH
        </Text>
      </AppBody>
    </Page>
  )
}

LiquidStakingStakePage.chains = CHAIN_IDS

export default LiquidStakingStakePage
