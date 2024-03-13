import { useState } from 'react'
import { ellipseAddress } from 'utils/address'
import { useAccount } from 'wagmi'
import { AceIcon, AutoRow, Button, useModal } from '@pancakeswap/uikit'
import MakeOfferModal from 'components/nfts/MakeOfferModal'
import ListModal from 'components/nfts/ListModal'
import { DEFAULT_COLLECTION_AVATAR } from 'config/nfts'
import { displayBalance } from 'utils/display'
import Link from 'next/link'
import Modal from '../../Modal2'
import { Wrapper } from './adventure.style'

export default function Adventure({ nft, refetch }: { nft: any; refetch: any }) {
  const [showMakeOfferModal] = useModal(
    <MakeOfferModal collectionAddress={nft?.collection_contract_address} tokenId={nft?.token_id} refetch={refetch} />,
  )
  const [showListModal] = useModal(
    <ListModal collectionAddress={nft?.collection_contract_address} tokenId={nft?.token_id} refetch={refetch} />,
  )
  const { address } = useAccount()
  const [showListConfirmModal, setShowListConfirmModal] = useState(false)
  const [showCancelListModal, setShowCancelListModal] = useState(false)
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
              <Button onClick={showListModal} width="200px">
                List
              </Button>
            )}
            {!isOwner && (
              <Button onClick={showMakeOfferModal} width="200px">
                Make offer
              </Button>
            )}
          </AutoRow>
        </div>

        {showListConfirmModal && (
          <Modal title="🎉 You did it! " onClose={() => {}} confirmText="Share">
            You have successfully purchased item!{' '}
          </Modal>
        )}
        {/* item属于用户-已上架 */}
        {showCancelListModal && (
          <Modal
            titleElement={
              <div
                style={{
                  display: 'flex',
                  fontSize: '16px',
                  lineHeight: '32px',
                  height: '32px',
                  fontWeight: 500,
                  alignItems: 'center',
                }}
              >
                Cancel listing
              </div>
            }
            onClose={() => {}}
            showCancel
            onCancel={() => {}}
            onConfirm={() => {}}
          >
            Are you sure you want to cancel the listing?
          </Modal>
        )}
      </div>
    </Wrapper>
  )
}
