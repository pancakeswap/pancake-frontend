/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

import { getNftList } from '../api/nft'
import sgtIcon from '../assets/sgt-icon.png'
import sgt from '../assets/sgt.png'
import Button from '../components/button/index'
import Tag from '../components/tag/tag'

// import './index.style.css'
const Wrapper = styled.div`
  .nft-list__wrapper {
    padding: 0px 50px;
  }
  .nft-list__collection {
    box-sizing: border-box;
    padding: 32px;
    width: 1340px;
    border-radius: 8px;
    height: 144px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #1c1c1e;
    border: 1px solid #3a3a3c;
  }
  .nft-list__collection-total-box {
    width: 360px;
    height: 80px;
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
  .nft-list__collection-icon {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    /* border: 1px solid #fff; */
  }
  .nft-list__collection-total {
  }
  .nft-list__collection-name {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
    color: #fff;
  }
  .nft-list__collection-icon-list {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
  .nft-list__collection-icon-item {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
  }
  .nft-list__collection-table {
    width: 900px;
    height: 52px;
  }
  .nft-list__game-image {
    box-sizing: border-box;
    width: 56px;
    height: 56px;
    border-radius: 4px;
    border: 1px solid #fff;
  }
  .nft-list__game-name {
    margin-left: 16px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #fff;
  }
  .nft-list__icon {
    margin-left: 4px;
    width: 20px;
    height: 20px;
  }
`

const SortButtonWrapper = styled.div`
  .sensei__arrow-box {
    box-sizing: border-box;
    padding: 2px 0;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  .sensei__arrow {
    width: 5px;
    height: 5px;
    box-sizing: border-box;
    border-color: rgba(255, 255, 255, 0.3);
    border-style: solid;
    border-width: 0 1px 1px 0;
    border-radius: 1px;
    transform-origin: center;
  }
  .sensei__arrow-up {
    transform: rotate(-135deg);
  }
  .sensei__arrow-down {
    transform: rotate(45deg);
  }
  .sensei__arrow--active {
    border-color: rgba(255, 255, 255, 0.95);
  }
`
type ISortButton = {
  type: 'asc' | 'desc' | 'none'
  onClick: () => void
}

const SortButton = ({ type, onClick }: ISortButton) => {
  const upClassName = type === 'asc' ? 'sensei__arrow--active' : ''
  const downClassName = type === 'desc' ? 'sensei__arrow--active' : ''
  return (
    <SortButtonWrapper>
      <div className="sensei__arrow-box" onClick={onClick}>
        <div className={`sensei__arrow sensei__arrow-up ${upClassName}`} />
        <div className={`sensei__arrow sensei__arrow-down ${downClassName}`} />
      </div>
    </SortButtonWrapper>
  )
}

export default function SGTList() {
  const [list, setList] = useState<any[]>([])
  // const defaultItem = {
  //   id: 1,
  //   image: sgt,
  //   name: "SGT name game",
  //   sgtPrice: 3.66,
  //   sgtPriceIcon: sgtIcon,
  //   revenue: 3.66,
  //   revenueIcon: sgtIcon,
  //   players: 3000,
  //   sgtpPrice: 3000,
  //   sgtpPriceIcon: sgtIcon,
  //   sgtpPriceChange: "+56%",
  //   sgtpTxns: 3000,
  //   sgtpVol: 3000,
  //   sgtpVolIcon: sgtIcon,
  // };
  // const [datasetList, setDatasetList] = useState([
  //   defaultItem,
  //   defaultItem,
  //   defaultItem,
  //   defaultItem,
  // ]);
  useEffect(() => {
    const init = async () => {
      const res = await getNftList()
      setList(res)
    }
    init()
  }, [])
  const _columns = [
    {
      name: 'NFT',
      sortType: 'none',
      style: {
        width: '320px',
        justifyContent: 'flex-start',
      },
    },
    {
      name: 'Rarity',
      sortType: 'none',
      style: {
        width: '110px',
        justifyContent: 'flex-end',
      },
    },
    {
      name: 'Price',
      sortType: 'none',
      style: {
        width: '140px',
        justifyContent: 'flex-end',
      },
    },
    {
      name: 'Last Sale',
      sortType: 'none',
      style: {
        width: '140px',
        justifyContent: 'flex-end',
      },
    },

    {
      name: 'Top BID',
      sortType: 'none',
      style: {
        width: '140px',
        justifyContent: 'flex-end',
      },
    },
    {
      name: 'Owners',
      sortType: 'none',
      style: {
        width: '140px',
        justifyContent: 'flex-end',
      },
    },
    {
      name: '',
      sortType: 'none',
      style: {
        paddingLeft: '32px',
        flex: '1',
        justifyContent: 'flex-end',
      },
    },
  ]
  const collectionColumns = [
    {
      name: 'Floor Price',
      sortType: 'none',
      style: {
        width: '140px',
      },
      tdStyle: {
        height: '24px',
      },
    },
    {
      name: 'Top BID',
      sortType: 'none',
      style: {
        width: '140px',
      },
      tdStyle: {
        height: '24px',
      },
    },
    {
      name: 'Owners',
      sortType: 'none',
      style: {
        width: '140px',
      },
      tdStyle: {
        height: '24px',
      },
    },
    {
      name: 'Supply',
      sortType: 'none',
      style: {
        width: '140px',
      },
      tdStyle: {
        height: '24px',
      },
    },
    {
      name: '1D Volume',
      sortType: 'none',
      style: {
        width: '200px',
      },
      tdStyle: {
        height: '24px',
      },
    },
    {
      name: '3D Volume',
      sortType: 'none',
      style: {
        width: '200px',
      },
      tdStyle: {
        height: '24px',
      },
    },
  ]

  const _collectionList = [
    {
      id: '1',
      floor_price_icon: sgtIcon,
      floor_price: '3.66',
      top_bid: '3.66',
      top_bid_icon: sgtIcon,
      Owners: '3000',
      supply: '3000',
      vol_1d: '3000',
      vol_1d_icon: sgtIcon,
      vol_1d_change: '+56%',
      vol_3d: '3000',
      vol_3d_icon: sgtIcon,
      vol_3d_change: '-56%',
    },
  ]

  const [columns, setColumns] = useState(_columns)
  const [collectionList, setCollectionList] = useState(_collectionList)
  return (
    <Wrapper>
      <div className="nft-list__wrapper">
        <div className="nft-list__collection">
          <div className="nft-list__collection-total-box">
            <Image src={sgt} alt="" className="nft-list__collection-icon" />
            <div className="nft-list__collection-total">
              <div className="nft-list__collection-total-name">NFT Collection</div>
              <div className="nft-list__collection-icon-list">
                <img src="" alt="" className="nft-list__collection-icon-item" />
              </div>
            </div>
          </div>
          <div className="nft-list__collection-table">
            <div className="sensei__table">
              <div className="sensei__table-header">
                {collectionColumns.map((item, index) => {
                  return (
                    <div key={item.name} style={item.style} className="sensei__table-header-item">
                      {item.name}
                    </div>
                  )
                })}
              </div>
              <div className="sensei__table-body">
                {collectionList.map((item, index) => {
                  return (
                    <div
                      className="sensei__table-body-tr"
                      style={{
                        height: '24px',
                        marginTop: '4px',
                        justifyContent: 'space-between',
                      }}
                      key={item.id}
                    >
                      <div
                        style={{
                          ...collectionColumns[0].style,
                          ...(collectionColumns[0].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.floor_price}
                        <Image
                          style={{
                            width: '16px',
                            height: '16px',
                            marginLeft: '4px',
                          }}
                          alt="icon"
                          src={item.floor_price_icon}
                        />
                      </div>
                      <div
                        style={{
                          ...collectionColumns[1].style,
                          ...(collectionColumns[1].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.top_bid}
                        <Image
                          style={{
                            width: '16px',
                            height: '16px',
                            marginLeft: '4px',
                          }}
                          alt="icon"
                          src={item.top_bid_icon}
                        />
                      </div>
                      <div
                        style={{
                          ...collectionColumns[2].style,
                          ...(collectionColumns[2].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.Owners}
                      </div>
                      <div
                        style={{
                          ...collectionColumns[3].style,
                          ...(collectionColumns[3].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.supply}
                      </div>

                      <div
                        style={{
                          ...collectionColumns[4].style,
                          ...(collectionColumns[4].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.vol_1d}
                        <Image
                          style={{
                            width: '16px',
                            height: '16px',
                            marginLeft: '4px',
                          }}
                          alt="icon"
                          src={item.vol_1d_icon}
                        />
                        <Tag
                          style={{ marginLeft: '8px' }}
                          bgColor={
                            item.vol_1d_change.indexOf('-') > -1 ? 'rgba(5, 201, 154, .12)' : 'rgba(245, 99, 90, .12)'
                          }
                          color={item.vol_1d_change.indexOf('-') > -1 ? 'rgba(5, 201, 154, 1)' : 'rgba(245, 99, 90, 1)'}
                        >
                          {item.vol_1d_change}
                        </Tag>
                      </div>

                      <div
                        style={{
                          ...collectionColumns[5].style,
                          ...(collectionColumns[5].tdStyle || {}),
                        }}
                        className="sensei__table-body-td"
                      >
                        {item.vol_3d}
                        <Image
                          style={{
                            width: '16px',
                            height: '16px',
                            marginLeft: '4px',
                          }}
                          alt="icon"
                          src={item.vol_3d_icon}
                        />
                        <Tag
                          style={{ marginLeft: '8px' }}
                          bgColor={
                            item.vol_3d_change.indexOf('-') > -1 ? 'rgba(5, 201, 154, .12)' : 'rgba(245, 99, 90, .12)'
                          }
                          color={item.vol_3d_change.indexOf('-') > -1 ? 'rgba(5, 201, 154, 1)' : 'rgba(245, 99, 90, 1)'}
                        >
                          {item.vol_3d_change}
                        </Tag>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="sensei__table" style={{ marginTop: '24px' }}>
          <div className="sensei__table-header" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
            {columns.map((item, index) => {
              return (
                <div key={item.name} style={item.style} className="sensei__table-header-item">
                  {item.name}
                  {index > 0 && index < columns.length - 1 && (
                    <SortButton
                      type={item.sortType as 'asc' | 'desc' | 'none'}
                      onClick={() => {
                        const newColumns = columns.map((column, i) => {
                          if (i === index) {
                            if (column.sortType === 'asc') {
                              return { ...column, sortType: 'desc' }
                            }
                            if (column.sortType === 'desc') {
                              return { ...column, sortType: 'none' }
                            }
                            return { ...column, sortType: 'asc' }
                          }
                          return { ...column }
                        })
                        setColumns(newColumns)
                        console.log('click', index)
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className="sensei__table-body" style={{ marginTop: '20px', gap: '8px' }}>
            {(list || []).map((item, index) => {
              return (
                <div
                  className="sensei__table-body-tr sensei__table-body-tr-hover"
                  key={item.name + item.index + Math.random()}
                  style={{
                    height: '72px',
                  }}
                >
                  <div style={columns[0].style} className="sensei__table-body-td">
                    <Image className="nft-list__game-image" width={56} height={56} src={item.image} alt="game image" />
                    <div className="nft-list__game-name">{item.name}</div>
                  </div>
                  <div style={columns[1].style} className="sensei__table-body-td">
                    {item.rarity}
                  </div>
                  <div style={columns[2].style} className="sensei__table-body-td">
                    {item.price}
                    <Image className="nft-list__icon" alt="icon" src={item.price_icon} />
                  </div>
                  <div style={columns[3].style} className="sensei__table-body-td">
                    {item.last_sale}
                    <Image className="nft-list__icon" alt="icon" src={item.last_sale_icon} />
                  </div>
                  <div style={columns[4].style} className="sensei__table-body-td">
                    {item.top_bid}
                    <Image className="nft-list__icon" alt="icon" src={item.top_bid_icon} />
                  </div>
                  <div style={columns[5].style} className="sensei__table-body-td">
                    {item.owner}
                  </div>
                  <div style={columns[6].style} className="sensei__table-body-td">
                    <Button style={{ width: '132px' }} type="transparent">
                      Buy
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
