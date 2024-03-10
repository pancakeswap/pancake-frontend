'use client'

import Image from 'next/image'
import { useState } from 'react'

import avatarPng from '../../../public/images/nfts2/avatar.png'
import sgtIcon from '../../../public/images/nfts2/sgt-icon.png'
import Button from '../../components/Button'
import { Wrapper } from './index.style'

export default function User() {
  const [activeNav, setActiveNav] = useState('nft')
  const defaultItem = {
    id: 1,
    icon: sgtIcon,
    name: 'KAMA',
    floorPrice: '3.66 ACE',
    bestOffer: '3.66 ACE',
    listingPrice: '3.66 ACE',
    cost: '3.66 ACE',
    time: '8mo ago',
    sgr: '+56.12',
    sgrIcon: sgtIcon,
    difference: '+3',
    differenceIcon: sgtIcon,
  }
  const datasetList = [defaultItem, defaultItem, defaultItem, defaultItem]
  const defaultOfferModeItem = {
    name: 'BAYC',
    icon: sgtIcon,
    price: '2.53 ACE',
    quantity: '2',
    total: '2.53 ACE',
    timeCreated: '8mo ago',
  }
  const offerModeList = [defaultOfferModeItem, defaultOfferModeItem, defaultOfferModeItem, defaultOfferModeItem]
  const columns = [
    {
      name: '12 items',
      style: {
        width: '130px',
      },
      tdStyle: {},
    },
    {
      name: 'Floor Price',
      style: {
        width: '130px',
      },
      tdStyle: {},
    },
    {
      name: 'Best offer',
      style: {
        width: '130px',
      },
    },
    {
      name: 'Listing Price',
      style: {
        width: '130px',
      },
    },
    {
      name: 'Cost',
      style: {
        width: '130px',
      },
    },
    {
      name: 'Time',
      style: {
        width: '120px',
      },
    },
    {
      name: 'SGR',
      style: {
        width: '120px',
      },
    },
    {
      name: 'Difference ',
      style: {
        width: '120px',
      },
    },
    {
      name: '',
      style: {
        paddingLeft: '32px',
        flex: '1',
      },
    },
  ]
  const offerModeColumns = [
    {
      name: '12 Offers',
      style: {
        width: '130px',
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
        width: '130px',
      },
    },
    {
      name: '',
      style: {
        flex: 1,
      },
    },
  ]
  return (
    <Wrapper>
      <div className="user__wrapper">
        <div className="user__total-box">
          <div className="user__total-msg-box">
            <Image src={avatarPng} alt="avatar" className="user__total-msg-avatar" />
            <div className="user__total-msg-content">
              <div className="user__total-msg-user-name">Stella</div>
              <div className="user__total-msg-address">0xa223</div>
            </div>
          </div>
          <div className="user__total-data-box">
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
              <div className="user__total-data-item-content">
                <Image src={sgtIcon} alt="icon" className="user__total-data-item-content-icon" />
                200
              </div>
            </div>
            <div className="user__total-data-item">
              <div className="user__total-data-item-label">SGT</div>
              <div className="user__total-data-item-content">
                <Image src={sgtIcon} alt="icon" className="user__total-data-item-content-icon" />
                10.27
              </div>
            </div>
            <div className="user__total-data-item">
              <div className="user__total-data-item-label"> Revenue</div>
              <div className="user__total-data-item-content">
                <Image src={sgtIcon} alt="icon" className="user__total-data-item-content-icon" />
                2.182
              </div>
            </div>
          </div>
        </div>

        <div className="user__graph-block" style={{ marginTop: '20px' }}>
          <div className="user__graph-block-title">Assets Owned</div>
          <div className="user-assets__nav">
            <div className={`user-assets__nav-item ${activeNav === 'nft' ? 'user-assets__nav-item--active' : ''}`}>
              NFT
            </div>
            <div className={`user-assets__nav-item ${activeNav === 'token' ? 'user-assets__nav-item--active' : ''}`}>
              Token
            </div>
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
              {datasetList.map((item, index) => {
                return (
                  <div className="sensei__table-body-tr" key={item.id}>
                    <div
                      style={{
                        ...columns[0].style,
                        ...(columns[0].tdStyle || {}),
                      }}
                      className="sensei__table-body-td"
                    >
                      <Image
                        style={{
                          width: '16px',
                          height: '16px',
                          marginRight: '4px',
                        }}
                        alt="icon"
                        src={item.icon}
                      />
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
                    <div
                      style={{
                        ...columns[6].style,
                        ...(columns[6].tdStyle || {}),
                      }}
                      className="sensei__table-body-td"
                    >
                      <div className="sensei__tag">
                        <div className="sensei__tag-content">{item.sgr}</div>
                        <Image
                          style={{
                            width: '20px',
                            height: '20px',
                            marginLeft: '4px',
                          }}
                          alt="icon"
                          src={item.sgrIcon}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        ...columns[7].style,
                        ...(columns[7].tdStyle || {}),
                      }}
                      className="sensei__table-body-td"
                    >
                      <div className="sensei__tag">
                        <div className="sensei__tag-content">{item.difference}</div>
                        <Image
                          style={{
                            width: '20px',
                            height: '20px',
                            marginLeft: '4px',
                          }}
                          alt="icon"
                          src={item.differenceIcon}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        ...columns[8].style,
                        ...(columns[8].tdStyle || {}),
                      }}
                      className="sensei__table-body-td"
                    >
                      <Button type="transparent" size="sm" style={{ width: '153px' }}>
                        Accept best offer
                      </Button>
                      <Button type="transparent" size="sm" style={{ width: '111px', marginLeft: '32px' }}>
                        List for sale
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="user__graph-block" style={{ marginTop: '20px' }}>
          <div className="user__graph-block-title">Offers made</div>
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
              {offerModeList.map((item, index) => {
                return (
                  <div className="sensei__table-body-tr" key={item.name}>
                    <div
                      style={{
                        ...columns[0].style,
                        ...(columns[0].tdStyle || {}),
                      }}
                      className="sensei__table-body-td"
                    >
                      {item.name}
                      <Image
                        style={{
                          width: '16px',
                          height: '16px',
                          marginLeft: '4px',
                        }}
                        alt="icon"
                        src={item.icon}
                      />
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
                      <Button type="transparent" size="sm" style={{ width: '111px' }}>
                        Cancel offer
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
