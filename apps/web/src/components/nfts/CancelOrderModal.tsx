import { AutoRow, Button, Flex, InjectedModalProps, Loading, Modal, ModalBody, useToast } from '@pancakeswap/uikit'
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

export interface ListModalProps extends InjectedModalProps {
  mode?: string
  refetch?: any
}
const CancelOrderModal = ({ onDismiss, refetch }: ListModalProps) => {
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const signer = useEthersSigner()
  const { toastSuccess, toastError } = useToast()
  const { data: balance } = useBalance({
    address,
  })
  const onList = async () => {
    if (!signer) return
    setLoading(true)

    try {
      // @ts-ignore
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: '0xFF28baa302C29cFcbe898A10d4AD4f3CA574D02F' },
      })

      onDismiss?.()
      toastSuccess('List successfully')
      refetch?.()
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const { t } = useTranslation()

  return (
    <Modal title={t('List')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      Are you sure you want to cancel the listing?
      {/* <Flex justifyContent="space-between" py="10px"> */}
      {/*  <div className="sgt-adventure__modal-total-label">Total received</div> */}
      {/*  <div className="sgt-adventure__modal-total-value">0.95 ACE</div> */}
      {/* </Flex> */}
      <AutoRow gap="12px">
        <Button onClick={onDismiss} mt="20px">
          Cancel
        </Button>
        <Button onClick={onList} mt="20px" isLoading={loading}>
          {loading && <Loading mr="10px" />}
          Confirm
        </Button>
      </AutoRow>
    </Modal>
  )
}

export default CancelOrderModal
