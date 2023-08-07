import { useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { Button, useToast, AutoRenewIcon } from '@pancakeswap/uikit'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { masterChefV3Addresses } from '@pancakeswap/farms'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { Currency, CurrencyAmount, ERC20Token, ChainId } from '@pancakeswap/sdk'
import { useLiquidStakingApprove } from 'views/LiquidStaking/hooks/useLiquidStakingApprove'
import { useLiquidStakingApprovalStatus } from 'views/LiquidStaking/hooks/useLiquidStakingApprovalStatus'
import { useContract } from 'hooks/useContract'
import { SNBNB } from 'config/constants/liquidStaking'

interface LiquidStakingButtonProps {
  quoteAmount: BigNumber
  inputCurrency: Currency | ERC20Token
  currentAmount: BigNumber
  selectedList: LiquidStakingList
  currencyBalance: CurrencyAmount<Currency>
}

const LiquidStakingButton: React.FC<LiquidStakingButtonProps> = ({
  quoteAmount,
  inputCurrency,
  currentAmount,
  selectedList,
  currencyBalance,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { account, chainId } = useAccountActiveChain()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading } = useCatchTxError()

  const masterChefAddress = masterChefV3Addresses[chainId]
  const contract = useContract(selectedList?.contract, selectedList?.abi)

  const balance = useMemo(
    () => (currencyBalance ? new BigNumber(currencyBalance.quotient.toString()) : BIG_ZERO),
    [currencyBalance],
  )

  const convertedStakeAmount =
    currentAmount && inputCurrency ? getDecimalAmount(currentAmount, inputCurrency.decimals) : BIG_ZERO

  const { isApproved, allowance, setLastUpdated } = useLiquidStakingApprovalStatus({
    approveToken: selectedList?.approveToken?.address,
    contractAddress: selectedList?.contract,
    shouldCheckApproval: selectedList?.shouldCheckApproval,
  })

  const { isPending, onApprove } = useLiquidStakingApprove({
    approveToken: selectedList?.approveToken?.address,
    contractAddress: selectedList?.contract,
  })

  const isApprovedEnough = useMemo(
    () => !selectedList?.shouldCheckApproval || (isApproved && allowance?.isGreaterThanOrEqualTo(convertedStakeAmount)),
    [allowance, convertedStakeAmount, isApproved, selectedList?.shouldCheckApproval],
  )

  useEffect(() => {
    if (selectedList?.shouldCheckApproval) {
      setLastUpdated()
    }
  }, [isPending, setLastUpdated, selectedList])

  const onStake = useCallback(async () => {
    if (!convertedStakeAmount || !account) return

    const receipt = await fetchWithCatchTxError(() => {
      // SNBNB
      if (selectedList?.contract === SNBNB[ChainId.BSC]) {
        return callWithGasPrice(contract, 'deposit', [], {
          value: BigInt(convertedStakeAmount.toString()),
        })
      }

      // WBETH
      if ([ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId)) {
        const methodArgs = [masterChefAddress] as const
        return callWithGasPrice(contract, 'deposit', methodArgs, {
          value: BigInt(convertedStakeAmount.toString()),
        })
      }

      const methodArgs = [BigInt(convertedStakeAmount.toString()), masterChefAddress] as const
      return callWithGasPrice(contract, 'deposit', methodArgs, {})
    })

    const decimals = selectedList?.token0?.decimals
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
    contract,
    convertedStakeAmount,
    fetchWithCatchTxError,
    masterChefAddress,
    quoteAmount,
    router,
    selectedList?.contract,
    selectedList?.token0?.decimals,
    t,
    toastSuccess,
  ])

  const error = useMemo(() => {
    if (convertedStakeAmount?.isGreaterThan(balance)) {
      return t('Insufficient Balance')
    }
    if (convertedStakeAmount?.toString()?.includes('.') || !currentAmount?.isGreaterThan(0)) {
      return t('Enter an amount')
    }
    return ''
  }, [balance, convertedStakeAmount, currentAmount, t])

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (error) {
    return (
      <Button disabled width="100%">
        {error}
      </Button>
    )
  }

  if (!isApprovedEnough) {
    return (
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
  }

  return (
    <Button
      width="100%"
      endIcon={loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
      isLoading={loading}
      onClick={onStake}
    >
      {loading ? `${t('Staking')}` : t('Stake')}
    </Button>
  )
}

export default LiquidStakingButton
