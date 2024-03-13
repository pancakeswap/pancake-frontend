import { Box, Button, InjectedModalProps, Loading, Modal, ModalBody, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAccount, useBalance } from 'wagmi'
import PriceInput from 'components/PriceInput'
import TokenSelect from 'components/TokenSelect'
import { useEthersSigner } from 'utils/ethers'
import { parseEther } from 'viem'
import { DOCKMAN_HOST } from 'config/nfts'
import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { useState } from 'react'
import { displayBalance } from 'utils/display'

export interface MakeOfferModalProps extends InjectedModalProps {
  collectionAddress: string
  tokenId: string
  mode?: string
  refetch?: any
}
const MakeOfferModal = ({ collectionAddress, tokenId, onDismiss, refetch }: MakeOfferModalProps) => {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const signer = useEthersSigner()
  const { toastSuccess, toastError } = useToast()
  const { data: balance } = useBalance({
    address,
  })
  const onMakeOffer = async () => {
    if (!signer) return
    setLoading(true)
    try {
      // @ts-ignore
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: '0xFF28baa302C29cFcbe898A10d4AD4f3CA574D02F' },
      })

      const takerOrder = {
        zone: '0x0000000000000000000000000000000000000000',
        startTime: Math.floor(new Date().getTime() / 1000).toString(),
        endTime: Math.floor(new Date().getTime() / 1000 + 2 * 30 * 24 * 60 * 60).toString(),
        offer: [
          {
            amount: parseEther(amount).toString(),
            endAmount: parseEther(amount).toString(),
            recipient: address,
          },
        ],
        consideration: [
          {
            itemType: ItemType.ERC721,
            token: collectionAddress,
            identifier: tokenId,
            amount: '1',
          },
        ],
        allowPartialFills: true,
      }
      const { executeAllActions } = await seaport.createOrder(takerOrder, address)
      const order = await executeAllActions()

      await fetch(`${DOCKMAN_HOST}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order,
          chain_id: '648',
        }),
      })
      onDismiss?.()
      toastSuccess('Make offer successfully')
      refetch?.()
    } catch (e: any) {
      toastError(e.toString())
    }

    setLoading(false)
  }

  const { t } = useTranslation()

  return (
    <Modal title={t('Make Offer')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <PriceInput
        label="Offer Price"
        balance={displayBalance(balance?.value)}
        amount={amount}
        setAmount={setAmount}
        errorMsg=""
        suffix={<TokenSelect />}
      />
      <Button mt="20px" onClick={onMakeOffer} isLoading={loading}>
        {loading && <Loading mr="10px" />}
        Confirm
      </Button>
    </Modal>
  )
}

export default MakeOfferModal
