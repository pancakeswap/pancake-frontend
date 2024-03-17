'use client'

import { AceIcon, Button, Container, Flex, Link, Loading, Row, Text } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import { DEFAULT_AVATAR, DEFAULT_NFT_IMAGE, DOCKMAN_HOST } from 'config/nfts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'
import styled from 'styled-components'
import { ellipseAddress } from 'utils/address'
import { displayBalance } from 'utils/display'
import { useAccount } from 'wagmi'

dayjs.extend(relativeTime)
const ShowAcePrice = ({ price }: { price: any }) => {
  return (
    <>
      {price ? (
        <Row gap="4px">
          {displayBalance(price)}
          <AceIcon />
        </Row>
      ) : (
        <>--</>
      )}
    </>
  )
}

export const Wrapper = styled.div`
  & div::-webkit-scrollbar {
    display: none;
  }
  .user__wrapper {
    /* min-width: 1440px; */
    padding: 20px 24px;
    flex-grow: 1;
    flex-shrink: 0;
    overflow-y: auto;
  }
  .user__total-box {
    padding-left: 24px;
    height: 96px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .user__total-msg-box {
    display: flex;
    flex-direction: rox;
    align-items: center;
    gap: 16px;
  }
  .user__total-msg-avatar {
    width: 80px;
    height: 80px;
  }
  .user__total-msg-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user__total-msg-user-name {
    height: 36px;
    line-height: 36px;
    font-size: 24px;
    font-weight: bold;
  }
  .user__total-msg-address {
    margin-top: 4px;
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #928d88;
  }
  .user__total-data-box {
    box-sizing: border-box;
    padding: 0 40px;
    border-radius: 8px;
    height: 96px;
    width: 629px;
    background: rgba(28, 28, 30, 1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  /* .user__total-data-item {

} */
  .user__total-data-item-label {
    font-size: 14px;
    line-height: 14px;
    color: rgba(255, 255, 255, 0.95);
  }
  .user__total-data-item-content {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 18px;
    font-size: 18px;
    font-weight: 500;
    line-height: 18px;
  }
  .user__total-data-item-content-icon {
    margin-right: 4px;
    width: 14px;
    height: 14px;
  }

  .user__navigation-box {
    margin-top: 36px;
    padding-left: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 35px;
    gap: 24px;
  }
  .user__navigation-item {
    position: relative;
    font-size: 16px;
    line-height: 21px;
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
    cursor: pointer;
  }
  .user__navigation-item--active {
    font-size: 16px;
    line-height: 21px;
    color: #fff;
    font-weight: 600;
  }
  .user__navigation-item--active::after {
    content: '';
    transform: translateX(-50%);
    position: absolute;
    top: 34px;
    left: 50%;
    width: 24px;
    height: 1px;
    background-color: #fff;
  }
  .user__graph-line {
    margin-top: 36px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    flex-wrap: nowrap;
  }
  .user__graph-block {
    position: relative;
    flex-grow: 1;
    flex-shrink: 0;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 24px;
    background: linear-gradient(0deg, rgba(18, 18, 18, 0.1), rgba(18, 18, 18, 0.1)),
      linear-gradient(0deg, #2c2c2e, #2c2c2e);
  }
  .user__graph-block-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    color: #fff;
  }

  .user__composition-total {
    margin-top: 32px;
  }
  .user__composition-total-label {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
  .user__composition-total-content {
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    height: 30px;
    align-items: baseline;
  }
  .user__composition-total-content-value {
    font-size: 24px;
    font-weight: 700;
    line-height: 30px;
  }
  .user__composition-total-content-unit {
    margin-left: 4px;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
  }
  .user__composition-list {
    width: 418px;
    margin-top: 24px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    flex-wrap: wrap;
  }
  .user__composition-item {
    box-sizing: border-box;
    padding: 12px;
    width: 195px;
    height: 80px;
  }
  .user__composition-item-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 14px;
    font-size: 14px;
    line-height: 14px;
  }
  .user__composition-item-label-circle {
    margin-right: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .user__composition-item-content {
    margin-top: 24px;
    height: 18px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 8px;
  }
  .user__composition-item-content-value {
    font-size: 18px;
    font-weight: 500;
    line-height: 18px;
  }
  .user__composition-item-content-suffix {
    font-size: 12px;
    font-weight: 500;
    line-height: 12px;
    color: rgba(5, 201, 154, 1);
  }
  .user__composition-graph-box {
    position: absolute;
    right: 48px;
    bottom: 38px;
    width: 224px;
    height: 224px;
  }

  /* pool */
  .user__pool {
    padding: 24px;
    width: 629px;
    flex-shrink: 0;
    /* background: rgba(44, 44, 46, 1);
  background: rgba(249, 143, 18, 0.05);
  background: linear-gradient(33.07deg, rgba(255, 204, 71, 0.2) -11.76%, rgba(0, 0, 0, 0) 63.49%); */
    background: linear-gradient(270deg, rgba(255, 204, 71, 0.2) -10.02%, rgba(0, 0, 0, 0) 100%);
  }
  .user__pool-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
  }
  .user__pool-list {
    margin-top: 16px;
  }
  .user__pool-list-item {
    margin-bottom: 20px;
  }
  .user__pool-list-item-label {
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    color: rgba(255, 255, 255, 0.72);
  }
  .user__pool-list-item-content {
    margin-top: 12px;
    border: 1px solid #f98f12;
    /* border-image-source: linear-gradient(233.8deg, #F98F12 5.24%, #432F18 117.3%); */
    background: linear-gradient(91.43deg, #3a2d1f 2.62%, rgba(58, 45, 31, 0) 102.3%),
      linear-gradient(233.8deg, #f98f12 5.24%, #432f18 117.3%);
    display: flex;
    flex-direction: row;
    gap: 60px;
    border-radius: 8px;
  }
  .user__pool-list-item-content-item {
    padding: 16px 12px;
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
  }
  .user__pool-list-item-content-item-title {
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    color: rgba(255, 255, 255, 0.72);
  }
  .user__pool-list-item-content-item-body {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    height: 48px;
  }
  .user__pool-list-item-content-item-body-value {
    font-family: PP Neue Machina;
    font-size: 40px;
    font-style: italic;
    font-weight: 800;
    line-height: 41px;
    color: #f98f12;
  }
  .user__pool-list-item-content-item-body-unit {
    margin-left: 4px;
    font-size: 16px;
    font-style: italic;
    font-weight: 700;
    line-height: 24px;
  }
  .user__pool-list-item-content-item-body-button {
    margin-left: 16px;
    width: 75px;
    height: 29px;
  }

  /* assets */
  .user-assets__nav {
    margin-top: 24px;
    margin-bottom: 12px;
    height: 36px;
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  .user-assets__nav-item {
    position: relative;
    font-size: 14px;
    line-height: 26px;
    color: rgba(255, 255, 255, 0.72);
    cursor: pointer;
  }
  .user-assets__nav-item--active {
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
    color: #fff;
  }
  .user-assets__nav-item--active::after {
    content: '';
    position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 1px;
    background: #fff;
  }

  .user__graph-block .sensei__table-body-tr,
  .user__graph-block .sensei__table-body-td {
    height: 56px;
  }

  .user__graph-list {
    margin: 24px auto 0;
    display: flex;
    flex-direction: row;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .user__graph-item-half {
    flex-shrink: 0;
    flex-grow: 0;
    width: 747px;
    height: 372px;
    border-radius: 16px;
    /* background-color: #fff;
  border: 1px solid #E8E4E0; */
  }
  .user__graph-item-full {
    flex-shrink: 0;
    flex-grow: 0;
    min-width: 1392px;
    max-width: 1392px;
    height: 372px;
    border-radius: 16px;
  }
  .sensei__tag {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
    height: 28px;
    border-radius: 16px;
    background-color: rgba(5, 201, 154, 0.12);
  }
  .sensei__tag-content {
    font-size: 16px;
    font-weight: 600;
    color: rgba(5, 201, 154, 1);
  }
`
export default function User() {
  const { address } = useAccount()
  const [activeNav, setActiveNav] = useState('nft')

  const { data } = useQuery({
    queryKey: ['userAssets', address],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/me/nft?page_number=1&page_size=50&owner_address=${address}`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!address,
  })

  const { data: offersRes } = useQuery({
    queryKey: ['userOffers', address],
    queryFn: () => {
      return fetch(
        `${DOCKMAN_HOST}/me/order?page_number=1&page_size=50&owner_address=${address}&order_market_type=Offer`,
        {
          method: 'GET',
        },
      ).then((r) => r.json())
    },
    enabled: !!address,
  })

  const { data: listRes } = useQuery({
    queryKey: ['userList', address],
    queryFn: () => {
      return fetch(
        `${DOCKMAN_HOST}/me/order?page_number=1&page_size=50&owner_address=${address}&order_market_type=List`,
        {
          method: 'GET',
        },
      ).then((r) => r.json())
    },
    enabled: !!address,
  })

  const totalCount = data?.meta?.totalCount
  const assets = data?.data
  const offers = offersRes?.data
  const list = listRes?.data

  const totalOfferCount = offersRes?.meta?.totalCount
  const totalListCount = listRes?.meta?.totalCount

  const offerModeList = offers?.map((offer) => ({
    id: offer?.nft_id,
    name: (
      <Flex style={{ fontSize: '14px' }} alignItems="center">
        <img
          src={offer?.nft_image ? offer?.nft_image : DEFAULT_NFT_IMAGE}
          width={38}
          height={38}
          alt="avatar"
          style={{ marginRight: '5px', borderRadius: '4px', border: '1px solid #fff' }}
        />
        {offer?.nft_name}
      </Flex>
    ),
    price: <ShowAcePrice price={offer?.price} />,
    quantity: offer?.quantity,
    total: <ShowAcePrice price={offer?.quantity * offer?.price} />,
    timeCreated: dayjs(offer.start_titme * 1000).fromNow(),
  }))

  const listModeList = list?.map((offer) => ({
    id: offer?.nft_id,
    name: (
      <Flex style={{ fontSize: '14px' }} alignItems="center">
        <img
          src={offer?.nft_image ? offer?.nft_image : DEFAULT_NFT_IMAGE}
          width={38}
          height={38}
          alt="avatar"
          style={{ marginRight: '5px', borderRadius: '4px', border: '1px solid #fff' }}
        />
        {offer?.nft_name}
      </Flex>
    ),
    price: <ShowAcePrice price={offer?.price} />,
    quantity: offer?.quantity,
    total: <ShowAcePrice price={offer?.quantity * offer?.price} />,
    timeCreated: dayjs(offer.start_titme * 1000).fromNow(),
  }))
  const offerModeColumns = [
    {
      name: `${totalOfferCount} Offers`,
      style: {
        width: `200px`,
      },
      tdStyle: {},
    },
    {
      name: 'Offer Price',
      style: {
        width: '130px',
      },
      tdStyle: {},
    },
    {
      name: 'Quantity',
      style: {
        width: '130px',
      },
    },
    {
      name: 'Total',
      style: {
        width: '130px',
      },
    },
    {
      name: 'Time Created',
      style: {
        width: '160px',
      },
    },
    {
      name: '',
      style: {
        flex: 1,
      },
    },
  ]

  const listModeColumns = [
    {
      name: `${totalListCount} List`,
      style: {
        width: `200px`,
      },
      tdStyle: {},
    },
    {
      name: 'Offer Price',
      style: {
        width: '130px',
      },
      tdStyle: {},
    },
    {
      name: 'Quantity',
      style: {
        width: '130px',
      },
    },
    {
      name: 'Total',
      style: {
        width: '130px',
      },
    },
    {
      name: 'Time Created',
      style: {
        width: '160px',
      },
    },
    {
      name: '',
      style: {
        flex: 1,
      },
    },
  ]

  const datasetList = assets?.map((asset) => ({
    id: asset?.nft_id,
    name: (
      <Flex style={{ fontSize: '14px' }} alignItems="center">
        <img
          src={asset?.nft_image ? asset?.nft_image : DEFAULT_NFT_IMAGE}
          width={38}
          height={38}
          alt="avatar"
          style={{ marginRight: '5px', borderRadius: '4px', border: '1px solid #fff' }}
        />
        {asset?.nft_name}
      </Flex>
    ),
    floorPrice: <ShowAcePrice price={asset?.collection_floor_price} />,
    bestOffer: <ShowAcePrice price={asset?.best_offer_price} />,
    listingPrice: <ShowAcePrice price={asset?.listing_price} />,
    cost: <ShowAcePrice price={asset?.cost_price} />,
    time: dayjs(asset?.buy_time).fromNow(),
    difference: '+3',
  }))

  const columns = [
    { name: `${totalCount} items`, style: { width: '200px' }, tdStyle: {} },
    { name: 'Floor Price', style: { width: '130px' }, tdStyle: {} },
    { name: 'Best offer', style: { width: '130px' } },
    { name: 'Listing Price', style: { width: '130px' } },
    { name: 'Cost', style: { width: '130px' } },
    { name: 'Time', style: { width: '120px' } },
    { name: '', style: { paddingLeft: '32px', flex: '1' } },
  ]

  if (!data || !offersRes) {
    return (
      <Flex alignItems="center" justifyContent="center" py="40px">
        <Loading color="primary" width="30px" height="30px" />
      </Flex>
    )
  }

  return (
    <Container>
      <Wrapper>
        <div className="user__wrapper">
          <div className="user__total-box">
            <div className="user__total-msg-box">
              <img src={DEFAULT_AVATAR} alt="avatar" className="user__total-msg-avatar" />
              <div>
                <Text fontSize="22px">{ellipseAddress(address)}</Text>
                <Text fontSize="14px" color="textSubtle">
                  {ellipseAddress(address)}
                </Text>
              </div>
            </div>
            <div className="user__total-data-box" style={{ display: 'none' }}>
              <div className="user__total-data-item">
                <div
                  className="user__total-data-item-label"
                  style={{
                    color: 'rgba(249, 143, 18, 1)',
                  }}
                >
                  Total Value
                </div>
                <div
                  className="user__total-data-item-content"
                  style={{
                    fontWeight: '700',
                    color: 'rgba(249, 143, 18, 1)',
                  }}
                >
                  21.826 ACE
                </div>
              </div>
              <div className="user__total-data-item">
                <div className="user__total-data-item-label">SGTP</div>
                <div className="user__total-data-item-content">200</div>
              </div>
              <div className="user__total-data-item">
                <div className="user__total-data-item-label">SGT</div>
                <div className="user__total-data-item-content">10.27</div>
              </div>
              <div className="user__total-data-item">
                <div className="user__total-data-item-label"> Revenue</div>
                <div className="user__total-data-item-content">2.182</div>
              </div>
            </div>
          </div>

          <div className="user__graph-block" style={{ marginTop: '20px' }}>
            <Text fontSize="20px" fontWeight={600}>
              Assets Owned
            </Text>
            <div className="user-assets__nav">
              <div className={`user-assets__nav-item ${activeNav === 'nft' ? 'user-assets__nav-item--active' : ''}`}>
                NFT
              </div>
              {/* <div className={`user-assets__nav-item ${activeNav === 'token' ? 'user-assets__nav-item--active' : ''}`}> */}
              {/*  Token */}
              {/* </div> */}
            </div>
            <div className="sensei__table" style={{ marginTop: '12px' }}>
              <div className="sensei__table-header">
                {columns.map((item, index) => {
                  return (
                    <div key={item.name} style={item.style} className="sensei__table-header-item">
                      {item.name}
                    </div>
                  )
                })}
              </div>
              <div className="sensei__table-body">
                {datasetList?.map((item, index) => {
                  return (
                    <Link href={`/nfts/detail/${item?.id}`} className="sensei__table-body-tr" key={item.id}>
                      <div
                        style={{
                          ...columns[0].style,
                          ...(columns[0].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          ...columns[1].style,
                          ...(columns[1].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.floorPrice}
                      </div>
                      <div
                        style={{
                          ...columns[2].style,
                          ...(columns[2].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.bestOffer}
                      </div>
                      <div
                        style={{
                          ...columns[3].style,
                          ...(columns[3].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.listingPrice}
                      </div>

                      <div
                        style={{
                          ...columns[4].style,
                          ...(columns[4].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.cost}
                      </div>
                      <div
                        style={{
                          ...columns[5].style,
                          ...(columns[5].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.time}
                      </div>
                    </Link>
                  )
                })}
                {!datasetList.length ? <span className="sensei__table-no-data">No Data</span> : ''}
              </div>
            </div>
          </div>
          <div className="user__graph-block" style={{ marginTop: '20px' }}>
            <Text fontSize="20px" fontWeight={600}>
              Offers
            </Text>
            <div className="sensei__table" style={{ marginTop: '24px' }}>
              <div className="sensei__table-header">
                {offerModeColumns.map((item, index) => {
                  return (
                    <div key={item.name} style={item.style} className="sensei__table-header-item">
                      {item.name}
                    </div>
                  )
                })}
              </div>
              <div className="sensei__table-body">
                {offerModeList?.map((item, index) => {
                  return (
                    <Link href={`/nfts/detail/${item.id}`} className="sensei__table-body-tr" key={item.name}>
                      <div
                        style={{
                          ...columns[0].style,
                          ...(columns[0].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          ...columns[1].style,
                          ...(columns[1].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.price}
                      </div>
                      <div
                        style={{
                          ...columns[2].style,
                          ...(columns[2].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.quantity}
                      </div>
                      <div
                        style={{
                          ...columns[3].style,
                          ...(columns[3].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.total}
                      </div>

                      <div
                        style={{
                          ...columns[4].style,
                          ...(columns[4].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.timeCreated}
                      </div>

                      <div
                        style={{
                          ...columns[5].style,
                          ...(columns[5].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        <Button scale="sm" style={{ width: '200px' }}>
                          Cancel
                        </Button>
                      </div>
                    </Link>
                  )
                })}
                {!offerModeList.length ? <span className="sensei__table-no-data">No Data</span> : ''}
              </div>
            </div>
          </div>

          <div className="user__graph-block" style={{ marginTop: '20px' }}>
            <Text fontSize="20px" fontWeight={600}>
              List
            </Text>
            <div className="sensei__table" style={{ marginTop: '24px' }}>
              <div className="sensei__table-header">
                {listModeColumns.map((item, index) => {
                  return (
                    <div key={item.name} style={item.style} className="sensei__table-header-item">
                      {item.name}
                    </div>
                  )
                })}
              </div>
              <div className="sensei__table-body">
                {listModeList?.map((item, index) => {
                  return (
                    <Link href={`/nfts/detail/${item.id}`} className="sensei__table-body-tr" key={item.name}>
                      <div
                        style={{
                          ...columns[0].style,
                          ...(columns[0].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          ...columns[1].style,
                          ...(columns[1].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.price}
                      </div>
                      <div
                        style={{
                          ...columns[2].style,
                          ...(columns[2].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.quantity}
                      </div>
                      <div
                        style={{
                          ...columns[3].style,
                          ...(columns[3].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.total}
                      </div>

                      <div
                        style={{
                          ...columns[4].style,
                          ...(columns[4].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.timeCreated}
                      </div>

                      <div
                        style={{
                          ...columns[5].style,
                          ...(columns[5].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        <Button
                          scale="sm"
                          style={{ width: '200px' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Link>
                  )
                })}
                {!listModeList.length ? <span className="sensei__table-no-data">No Data</span> : ''}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </Container>
  )
}
