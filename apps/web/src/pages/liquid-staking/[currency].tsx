import { useTranslation } from '@pancakeswap/localization'
import { CardBody, Text, RowBetween, Button, Box, useToast, Flex, Image, AutoRenewIcon } from '@pancakeswap/uikit'
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { WETH9, NATIVE, ChainId } from '@pancakeswap/sdk'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { ExchangeRateTitle } from 'views/LiquidStaking/components/ExchangeRateTitle'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import AddToWalletButton from 'components/AddToWallet/AddToWalletButton'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { LiquidStakingFAQs } from 'views/LiquidStaking/components/FAQs'
import { LiquidStakingApr } from 'views/LiquidStaking/components/LiquidStakingApr'
import { masterChefV3Addresses } from '@pancakeswap/farms'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useContractRead } from 'wagmi'
// import { calculateGasMargin } from 'utils'

const LiquidStakingStakePage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [stakeAmount, setStakeAmount] = useState('')
  // const [estimatedGas, setEstimatedGas] = useState()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading } = useCatchTxError()
  const { account, chainId } = useAccountActiveChain()

  const masterChefAddress = masterChefV3Addresses[chainId]

  const ethToken = [ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId) ? NATIVE[chainId] : WETH9[chainId]

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

  const wbethCurrency = useCurrency(wbethContract?.address)

  const wbethCurrencyBalance = useCurrencyBalance(account, wbethCurrency)

  const { data } = useContractRead({
    // @ts-ignore
    abi: wbethContract.abi,
    address: wbethContract.address,
    functionName: 'exchangeRate',
    watch: true,
    chainId,
  })

  const { isApproved, allowance, setLastUpdated } = useETHApprovalStatus(wbethContract?.address)

  const isApprovedEnough = isApproved && allowance?.isGreaterThanOrEqualTo(convertedStakeAmount)

  const { isPending, onApprove } = useApproveETH(wbethContract?.address)

  useEffect(() => {
    setLastUpdated()
  }, [isPending, setLastUpdated])

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
      if ([ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId)) {
        const methodArgs = [masterChefAddress] as const
        return callWithGasPrice(wbethContract, 'deposit', methodArgs, {
          value: BigInt(convertedStakeAmount.toString()),
        })
      }

      const methodArgs = [BigInt(convertedStakeAmount.toString()), masterChefAddress] as const

      return callWithGasPrice(wbethContract, 'deposit', methodArgs, {})
    })

    if (receipt?.status && quoteAmount) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {`${t('Received')} ${getFullDisplayBalance(quoteAmount, 0, decimals)} WBETH`}
        </ToastDescriptionWithTx>,
      )

      router.push('/liquid-staking')
    }
  }, [
    account,
    callWithGasPrice,
    chainId,
    convertedStakeAmount,
    decimals,
    fetchWithCatchTxError,
    masterChefAddress,
    quoteAmount,
    router,
    t,
    toastSuccess,
    wbethContract,
  ])

  let error = ''

  if (convertedStakeAmount?.isGreaterThan(balance)) {
    error = t('Insufficient Balance')
  } else if (convertedStakeAmount?.toString()?.includes('.') || !currentAmount?.isGreaterThan(0)) {
    error = t('Enter an amount')
  }

  let button = null

  if (!account) {
    button = <ConnectWalletButton width="100%" />
  } else if (error) {
    button = (
      <Button disabled width="100%">
        {error}
      </Button>
    )
  } else if (!isApprovedEnough) {
    button = (
      <Button
        endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        isLoading={isPending}
        onClick={() => {
          onApprove()
        }}
        width="100%"
      >
        {isPending ? t('Enabling') : t('Enable')}
      </Button>
    )
  } else if (isApprovedEnough && account) {
    button = (
      <Button
        endIcon={loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        isLoading={loading}
        onClick={onStake}
        width="100%"
      >
        {loading ? `${t('Staking')}` : t('Stake')}
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
          shouldCenter
        />
        <CardBody>
          <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
            {t('Deposit Amount')}
          </Text>
          <Box mb="16px">
            <CurrencyInputPanel
              showUSDPrice
              maxAmount={currencyBalance}
              disableCurrencySelect
              value={stakeAmount}
              onMax={() => setStakeAmount(maxAmountSpend(currencyBalance)?.toExact())}
              onUserInput={setStakeAmount}
              showQuickInputButton
              showMaxButton
              currency={inputCurrency}
              id="stake-liquidity-input-token"
              showCommonBases
            />
          </Box>
          <Flex justifyContent="space-between">
            <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
              {t('You will receive')}
            </Text>
            <Flex>
              <AddToWalletButton
                variant="text"
                p="0"
                pb="8px"
                pr="4px"
                height="auto"
                width="fit-content"
                tokenAddress={wbethContract?.address}
                tokenSymbol={wbethCurrency?.symbol}
                tokenDecimals={wbethCurrency?.decimals}
                tokenLogo={undefined}
              />
              <Text color="textSubtle" fontSize="12px" ellipsis>
                {t('Balance: %balance%', {
                  balance: wbethCurrencyBalance
                    ? getFullDisplayBalance(
                        new BigNumber(wbethCurrencyBalance.quotient.toString()),
                        wbethCurrencyBalance.currency.decimals,
                        6,
                      )
                    : '0',
                })}
              </Text>
            </Flex>
          </Flex>
          <LightGreyCard mb="16px" padding="8px 12px">
            <RowBetween>
              <Text>
                {quoteAmount && quoteAmount.isGreaterThan(0) ? getFullDisplayBalance(quoteAmount, 0, decimals) : '0'}
              </Text>
              <Flex>
                <Box width={24} height={24}>
                  <Image src={`/images/tokens/${wbethContract?.address}.png`} width={24} height={24} alt="WBETH" />
                </Box>
                <Text ml="4px">WBETH</Text>
              </Flex>
            </RowBetween>
          </LightGreyCard>
          <RowBetween mb="8px">
            <ExchangeRateTitle />
            {exchangeRateAmount ? (
              <Text>{`1 ETH = ${getFullDisplayBalance(exchangeRateAmount, 0, 8)} WBETH`}</Text>
            ) : (
              '-'
            )}
          </RowBetween>
          <LiquidStakingApr />
          {/*
          <RowBetween mb="24px">
            <Text color="textSubtle">Gas Fee</Text>-
          </RowBetween> */}

          {button}
        </CardBody>
      </AppBody>
      <AppBody>
        <LiquidStakingFAQs />
      </AppBody>
    </Page>
  )
}

LiquidStakingStakePage.chains = CHAIN_IDS

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { currency } = params

  if (!['ETH', 'WETH', 'GOR'].includes(currency as string)) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/liquid-staking`,
      },
    }
  }

  return {
    props: {},
  }
}

export default LiquidStakingStakePage
