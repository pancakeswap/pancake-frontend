import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerBCakeWrapperContract, usePositionManagerWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { Address } from 'viem'

export const useOnStake = (contractAddress: Address, bCakeWrapperAddress: Address) => {
  const positionManagerBCakeWrapperContract = usePositionManagerBCakeWrapperContract(bCakeWrapperAddress)
  const positionManagerWrapperContract = usePositionManagerWrapperContract(contractAddress)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const { chain, account } = useActiveWeb3React()
  const { t } = useTranslation()

  const mintThenDeposit = useCallback(
    async (
      amountA: CurrencyAmount<Currency>,
      amountB: CurrencyAmount<Currency>,
      allowDepositToken0: boolean,
      allowDepositToken1: boolean,
      onDone?: () => void,
    ) => {
      const receipt = await fetchWithCatchTxError(
        bCakeWrapperAddress
          ? async () => {
              const estGas = await positionManagerBCakeWrapperContract.estimateGas.mintThenDeposit(
                [
                  allowDepositToken0 ? amountA?.numerator ?? 0n : 0n,
                  allowDepositToken1 ? amountB?.numerator ?? 0n : 0n,
                  false,
                  '0x',
                ],
                {
                  account: account ?? '0x',
                },
              )
              console.log({
                estGasOrigin: estGas.toString(),
                estGasAdjusted: new BigNumber(estGas.toString()).times(1.5).toNumber(),
                from: account,
                to: positionManagerBCakeWrapperContract.address,
                method: 'mintThenDeposit',
                amounts: {
                  token0: allowDepositToken0 ? amountA?.numerator ?? 0n : 0n,
                  token1: allowDepositToken1 ? amountB?.numerator ?? 0n : 0n,
                },
              })
              return positionManagerBCakeWrapperContract.write.mintThenDeposit(
                [
                  allowDepositToken0 ? amountA?.numerator ?? 0n : 0n,
                  allowDepositToken1 ? amountB?.numerator ?? 0n : 0n,
                  false,
                  '0x',
                ],
                {
                  account: account ?? '0x',
                  chain,
                  gasLimit: new BigNumber(estGas.toString()).times(1.5).toNumber(),
                },
              )
            }
          : () =>
              positionManagerWrapperContract.write.mintThenDeposit(
                [
                  allowDepositToken0 ? amountA?.numerator ?? 0n : 0n,
                  allowDepositToken1 ? amountB?.numerator ?? 0n : 0n,
                  '0x',
                ],
                {
                  account: account ?? '0x',
                  chain,
                },
              ),
      )

      if (receipt?.status) {
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in position manager.')}
          </ToastDescriptionWithTx>,
        )
        onDone?.()
      }
    },
    [
      fetchWithCatchTxError,
      bCakeWrapperAddress,
      positionManagerBCakeWrapperContract.estimateGas,
      positionManagerBCakeWrapperContract.write,
      account,
      chain,
      positionManagerWrapperContract.write,
      toastSuccess,
      t,
    ],
  )

  const onUpdate = useCallback(
    async (onDone?: () => void) => {
      const receipt = await fetchWithCatchTxError(
        bCakeWrapperAddress
          ? () =>
              positionManagerBCakeWrapperContract.write.deposit([0n, false], {
                account: account ?? '0x',
                chain,
              })
          : () =>
              positionManagerWrapperContract.write.deposit([0n], {
                account: account ?? '0x',
                chain,
              }),
      )

      if (receipt?.status) {
        toastSuccess(
          `${t('Booster Update')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('booster has been updated.')}
          </ToastDescriptionWithTx>,
        )
        onDone?.()
      }
    },
    [
      fetchWithCatchTxError,
      bCakeWrapperAddress,
      positionManagerBCakeWrapperContract.write,
      account,
      chain,
      positionManagerWrapperContract.write,
      toastSuccess,
      t,
    ],
  )

  return {
    onStake: mintThenDeposit,
    onUpdate,
    isTxLoading: pendingTx,
  }
}
