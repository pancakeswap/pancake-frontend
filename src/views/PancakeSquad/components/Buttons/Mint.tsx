/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber } from '@ethersproject/bignumber'
import React, { useEffect, useState } from 'react'
import { AutoRenewIcon, Button, useModal } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useNftSaleContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { DefaultTheme } from 'styled-components'
import { SaleStatusEnum } from '../../types'
import ConfirmModal from '../Modals/Confirm'

type PreEventProps = {
  t: ContextApi['t']
  theme: DefaultTheme
  saleStatus: SaleStatusEnum
  numberTicketsOfUser: number
  numberTokensOfUser: number
  ticketsOfUser: BigNumber[]
}

const MintButton: React.FC<PreEventProps> = ({ t, theme, saleStatus, numberTicketsOfUser, ticketsOfUser }) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftSaleContract = useNftSaleContract()
  const [txHashMintingResult, setTxHashMintingResult] = useState(null)
  const canMintTickets = saleStatus === SaleStatusEnum.Claim && numberTicketsOfUser > 0
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isLoading } = useCatchTxError()

  const onConfirmClose = () => {
    setTxHashMintingResult(null)
  }

  const [onPresentConfirmModal, onDismiss] = useModal(
    <ConfirmModal
      title={t('Mint')}
      isLoading={isLoading}
      headerBackground={theme.colors.gradients.cardHeader}
      txHash={txHashMintingResult}
      loadingText={t('Please confirm your transaction in wallet.')}
      loadingButtonLabel={t('Minting...')}
      successButtonLabel={t('Close')}
      onConfirmClose={onConfirmClose}
    />,
    false,
  )

  const mintTokenCallBack = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(nftSaleContract, 'mint', [ticketsOfUser])
    })
    if (receipt?.status) {
      toastSuccess(t('Transaction has succeeded!'))
      setTxHashMintingResult(receipt.transactionHash)
    } else {
      onDismiss()
    }
  }

  useEffect(() => txHashMintingResult && !isLoading && onPresentConfirmModal(), [isLoading, txHashMintingResult])

  return (
    <>
      {canMintTickets && (
        <Button
          width="100%"
          onClick={mintTokenCallBack}
          disabled={isLoading}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Mint NFTs (%tickets%)', { tickets: numberTicketsOfUser })}
        </Button>
      )}
    </>
  )
}

export default MintButton
