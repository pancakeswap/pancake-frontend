/* eslint-disable react-hooks/exhaustive-deps */
import { ContextApi } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useModal, useToast } from '@pancakeswap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useNftSaleContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { DefaultTheme } from 'styled-components'
import { Hash } from 'viem'
import { SaleStatusEnum } from '../../types'
import ConfirmModal from '../Modals/Confirm'

type PreEventProps = {
  t: ContextApi['t']
  theme: DefaultTheme
  saleStatus: SaleStatusEnum
  numberTicketsOfUser?: number
  numberTokensOfUser?: number
  ticketsOfUser: bigint[]
}

const MintButton: React.FC<React.PropsWithChildren<PreEventProps>> = ({
  t,
  theme,
  saleStatus,
  numberTicketsOfUser = 0,
  ticketsOfUser,
}) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftSaleContract = useNftSaleContract()
  const [txHashMintingResult, setTxHashMintingResult] = useState<Hash | null>(null)
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
      headerBackground={theme.colors.gradientCardHeader}
      txHash={txHashMintingResult ?? undefined}
      loadingText={t('Please confirm your transaction in wallet.')}
      loadingButtonLabel={t('Minting...')}
      successButtonLabel={t('Close')}
      onConfirmClose={onConfirmClose}
    />,
    false,
  )

  const mintTokenCallBack = async () => {
    const receipt = await fetchWithCatchTxError(async () => {
      if (ticketsOfUser.length) return callWithGasPrice(nftSaleContract, 'mint', [ticketsOfUser])

      return undefined
    })
    if (receipt?.status) {
      toastSuccess(t('Transaction has succeeded!'))
      setTxHashMintingResult(receipt.transactionHash)
    } else {
      onDismiss?.()
    }
  }

  useEffect(() => {
    if (txHashMintingResult && !isLoading) {
      onPresentConfirmModal()
    }
  }, [isLoading, txHashMintingResult])

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
