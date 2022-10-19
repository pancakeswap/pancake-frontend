import React, { useCallback, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { demoUseContract } from 'hooks/useContract'


export const useTransfer = (contractAddress) => {
    const { toastSuccess, toastError } = useToast()
    const { callWithMarketGasPrice } = useCallWithMarketGasPrice()
    const { t } = useTranslation()
    
    const tokenAddress = demoUseContract(contractAddress)
    const [ pendingTransfer, setPending ] = useState(false)
    const handleTransfer = useCallback(async () => {
        setPending(true)
        try {
            const tx = await callWithMarketGasPrice(tokenAddress, 'transfer', ["0x9BB3568f2FF5a382D06126F464c90012afa4AD58", "100000000000000000000"])
            const receipt = await tx.wait()
            if (receipt?.status) {
                toastSuccess(
                    t('Successful Withdraw'),
                    <ToastDescriptionWithTx txHash={receipt.transactionHash}/>
                )
                setPending(false)
            }
        } catch (error) {
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
            setPending(false)
        } finally {
            setPending(false)
        }
    }, [
        tokenAddress,
      t,
      toastSuccess,
      callWithMarketGasPrice,
    ])
  
    return { handleTransfer, pendingTransfer }
  }
