import { useState } from 'react'
import { ellipseAddress } from 'utils/address'
import { useAccount } from 'wagmi'
import { AceIcon, AutoRow, Button, Flex, Link, Loading, useModal, useToast } from '@pancakeswap/uikit'
import MakeOfferModal from 'components/nfts/MakeOfferModal'
import ListModal from 'components/nfts/ListModal'
import { DEFAULT_COLLECTION_AVATAR, DOCKMAN_HOST, SEAPORT_ADDRESS } from 'config/nfts'
import { displayBalance } from 'utils/display'
import ConfirmRecycleModal from 'components/nfts/ConfirmRecycleModal'
import TransferModal from 'components/nfts/TransferModal'
import { Seaport } from '@opensea/seaport-js'
import { sleep } from 'utils/sleep'
import { useEthersSigner } from 'utils/ethers'
import { Wrapper } from './adventure.style'
import Modal from '../../Modal2'

export default function Adventure({ nft, refetch, list }: { nft: any; refetch: any; list: any }) {
  const [loading, setLoading] = useState(false)
  const signer = useEthersSigner()
  const { toastSuccess, toastError } = useToast()
  const [showMakeOfferModal] = useModal(
    <MakeOfferModal collectionAddress={nft?.collection_contract_address} tokenId={nft?.token_id} refetch={refetch} />,
  )
  const [showListModal] = useModal(
    <ListModal collectionAddress={nft?.collection_contract_address} tokenId={nft?.token_id} refetch={refetch} />,
  )
  const [showConfirmRecycleModal] = useModal(
    <ConfirmRecycleModal contract={nft?.collection_contract_address} tokenId={nft?.token_id} refetch={refetch} />,
  )

  const [showTransferModal] = useModal(
    <TransferModal collectionAddress={nft?.collection_contract_address} tokenId={nft?.token_id} refetch={refetch} />,
  )

  console.log(list)
  const topList =
    list?.length > 0
      ? list?.reduce(function (prev, curr) {
          return BigInt(prev.price) < BigInt(curr.price) ? prev : curr
        })
      : undefined

  const { address } = useAccount()
  const [showListConfirmModal, setShowListConfirmModal] = useState(false)
  const isOwner = address?.toLocaleLowerCase() === nft?.owner
  const dataList = [
    {
      label: 'Current Price',
      value: (
        <AutoRow gap="8px">
          {displayBalance(nft?.price)}
          <AceIcon />
        </AutoRow>
      ),
    },
    {
      label: 'Last sale',
      value: (
        <AutoRow gap="8px">
          {displayBalance(nft?.last_sale_price)}
          <AceIcon />
        </AutoRow>
      ),
    },
    {
      label: 'Top Bid',
      value: (
        <AutoRow gap="8px">
          {displayBalance(nft?.top_bid)}
          <AceIcon />
        </AutoRow>
      ),
    },
    {
      label: 'Collection  Floor',
      value: (
        <AutoRow gap="8px">
          {displayBalance(nft?.collection_floor_price)}
          <AceIcon />
        </AutoRow>
      ),
    },
  ]

  const onAccept = async () => {
    if (!signer) return
    setLoading(true)
    try {
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: SEAPORT_ADDRESS },
      })

      const tx = await seaport.fulfillOrder({ order: topList.order })
      const res = await tx.executeAllActions()

      for (let i = 0; i < 20; i++) {
        // eslint-disable-next-line no-await-in-loop
        const rr = await fetch(`${DOCKMAN_HOST}/orders/status?order_hash=${topList?.order_hash}`).then((r) => r.json())
        // eslint-disable-next-line no-await-in-loop
        await sleep(2000)
        if (rr?.order_status !== 'Normal') {
          break
        }
      }
      toastSuccess('Purchase successfully')

      refetch?.()
    } catch (e: any) {
      const msg = e.toString()
      if (msg.includes('have the balances')) {
        toastError('The fulfiller does not have the balances needed to fulfill.')
      }
      console.error(e.toString())
    }

    setLoading(false)
  }

  return (
    <Wrapper>
      <div className="sgt-adventure__wrapper">
        <Link href={`/nfts/list/${nft?.chain_id}-${nft?.collection_contract_address}`} className="sgt-adventure__user">
          <img
            src={nft?.collection_avatar ?? DEFAULT_COLLECTION_AVATAR}
            alt="avatar"
            className="sgt-adventure__user-avatar"
          />
          <div className="sgt-adventure__user-name">{nft?.collection_name}</div>
        </Link>
        <div className="sgt-adventure__title">{nft?.nft_name}</div>
        <div className="sgt-adventure__owner">Owner - {ellipseAddress(nft?.owner)}</div>
        <div className="sgt-adventure__list">
          {dataList.map((item, index) => {
            return (
              <div className="sgt-adventure__list-item" key={item.label}>
                <div className="sgt-adventure__list-item-label">{item.label}</div>
                <div
                  className="sgt-adventure__list-item-value"
                  style={{
                    color: index === 0 ? 'rgba(249, 143, 18, 1)' : '#fff',
                  }}
                >
                  {item.value}
                </div>
              </div>
            )
          })}
        </div>
        <div className="sgt-adventure__bottom">
          <AutoRow gap="20px" justifyContent="flex-end">
            {isOwner && (
              <Button
                onClick={showTransferModal}
                width="40px"
                scale="sm"
                variant="tertiary"
                style={{ color: '#999', padding: '12px' }}
              >
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.8078 13.6923L15.6539 8.84619M20.6113 5.88867L16.5207 19.1833C16.1541 20.3747 15.9706 20.9707 15.6544 21.1683C15.3802 21.3396 15.0406 21.3683 14.7419 21.2443C14.3975 21.1014 14.118 20.5433 13.5603 19.428L10.9694 14.2461C10.8809 14.0691 10.8366 13.981 10.7775 13.9043C10.725 13.8363 10.6645 13.7749 10.5965 13.7225C10.5215 13.6647 10.4349 13.6214 10.2658 13.5369L5.07192 10.9399C3.95662 10.3823 3.39892 10.1032 3.25601 9.75879C3.13207 9.4601 3.16033 9.12023 3.33169 8.84597C3.52928 8.52974 4.12523 8.34603 5.31704 7.97932L18.6116 3.88867C19.5486 3.60038 20.0173 3.45635 20.3337 3.57253C20.6094 3.67373 20.8267 3.89084 20.9279 4.16651C21.044 4.48283 20.8999 4.95126 20.6119 5.88729L20.6113 5.88867Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Button>
            )}

            {isOwner && (
              <Flex style={{ gap: '10px', marginLeft: 'auto' }}>
                <Button
                  onClick={showConfirmRecycleModal}
                  width="130px"
                  scale="sm"
                  variant="tertiary"
                  style={{ color: '#999' }}
                >
                  Recycle
                </Button>
                <Button onClick={showListModal} width="130px" scale="sm">
                  List
                </Button>
              </Flex>
            )}
            {!isOwner && (
              <Flex style={{ gap: '10px', marginLeft: 'auto' }}>
                <Button onClick={showMakeOfferModal} width="130px" scale="sm">
                  Make offer
                </Button>
                {!!topList && (
                  <Button onClick={onAccept} width="130px" scale="sm" isLoading={loading}>
                    {loading && <Loading />}
                    Buy now
                  </Button>
                )}
              </Flex>
            )}
          </AutoRow>
        </div>

        {showListConfirmModal && (
          <Modal title="🎉 You did it! " onClose={() => {}} confirmText="Share">
            You have successfully purchased item!{' '}
          </Modal>
        )}
      </div>
    </Wrapper>
  )
}
