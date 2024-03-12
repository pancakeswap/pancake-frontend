import { Button, Flex, InjectedModalProps, Modal, ModalBody } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAccount } from 'wagmi'
import PriceInput from 'components/PriceInput'
import TokenSelect from 'components/TokenSelect'
import { useEthersSigner } from 'utils/ethers'
import { parseEther } from 'viem'
import { DOCKMAN_HOST } from 'config/nfts'
import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { useState } from 'react'

export interface ListModalProps extends InjectedModalProps {
  collectionAddress: string
  tokenId: string
  mode?: string
}
const ListModal = ({ collectionAddress, tokenId, onDismiss }: ListModalProps) => {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const signer = useEthersSigner()
  const onList = async () => {
    if (!signer) return
    // @ts-ignore
    const seaport = new Seaport(signer, {
      overrides: { contractAddress: '0xFF28baa302C29cFcbe898A10d4AD4f3CA574D02F' },
    })

    const makerOrder = {
      zone: '0x0000000000000000000000000000000000000000',
      startTime: Math.floor(new Date().getTime() / 1000).toString(),
      endTime: Math.floor(new Date().getTime() / 1000 + 2 * 30 * 24 * 60 * 60).toString(),
      offer: [
        {
          itemType: ItemType.ERC721,
          token: collectionAddress,
          identifier: tokenId,
          amount: '1',
        },
      ],
      consideration: [
        {
          amount: parseEther(amount).toString(),
          endAmount: parseEther(amount).toString(),
          recipient: address,
        },
      ],
      allowPartialFills: true,
    }
    const { executeAllActions } = await seaport.createOrder(makerOrder, address)
    const order = await executeAllActions()

    fetch(`${DOCKMAN_HOST}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
        chain_id: '648',
      }),
    })
  }

  const { t } = useTranslation()

  return (
    <Modal title={t('List')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <ModalBody>
        <PriceInput
          label="Listing Price"
          balance="12.00"
          amount={amount}
          setAmount={setAmount}
          errorMsg=""
          suffix={<TokenSelect />}
        />
        <Flex justifyContent="space-between" py="10px">
          <div>Service Fee</div>
          <div>5%</div>
        </Flex>
        <Flex justifyContent="space-between" py="10px">
          <div className="sgt-adventure__modal-total-label">Total received</div>
          <div className="sgt-adventure__modal-total-value">0.95 ACE</div>
        </Flex>
        <Button onClick={onList}>Confirm</Button>
      </ModalBody>
    </Modal>
  )
}

export default ListModal
