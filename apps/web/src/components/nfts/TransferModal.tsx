import { Button, Flex, InjectedModalProps, Loading, Modal, ModalBody, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import {
  erc721ABI,
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import PriceInput from 'components/PriceInput'
import TokenSelect from 'components/TokenSelect'
import { useEthersSigner } from 'utils/ethers'
import { Address, parseEther, parseUnits } from 'viem'
import { DOCKMAN_HOST, RECYCLE_CONTRACT_ADDRESS } from 'config/nfts'
import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { useState } from 'react'
import { displayBalance } from 'utils/display'
import Input from 'components/Input'

export interface TransferModalProps extends InjectedModalProps {
  collectionAddress: string
  tokenId: string
  mode?: string
  refetch?: any
}
const TransferModal = ({ collectionAddress, tokenId, onDismiss, refetch }: TransferModalProps) => {
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const { toastSuccess, toastError } = useToast()

  const { config } = usePrepareContractWrite({
    address: collectionAddress as Address,
    abi: erc721ABI,
    functionName: 'safeTransferFrom',
    args: [address as Address, to as Address, parseUnits(tokenId, 0)],
  })

  const { write: transfer, data: approveTx, isLoading: isPreLoading } = useContractWrite(config)
  const { isLoading } = useWaitForTransaction({
    hash: approveTx?.hash,
    onSuccess: () => {
      toastSuccess('Transfer successfully')
      onDismiss?.()
    },
  })

  const { t } = useTranslation()

  return (
    <Modal title={t('Transfer')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <Input label="To" amount={to} setAmount={setTo} errorMsg="" />
      <Button onClick={transfer} mt="20px" isLoading={isLoading || isPreLoading}>
        {(isLoading || isPreLoading) && <Loading mr="10px" />}
        Confirm
      </Button>
    </Modal>
  )
}

export default TransferModal
