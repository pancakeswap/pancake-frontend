/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { AceIcon, AutoRow, Box, Button, Card, Container, Flex, Row, Text } from '@pancakeswap/uikit'
import { ellipseAddress } from 'utils/address'
import { DEFAULT_COLLECTION_AVATAR, DEFAULT_NFT_IMAGE, DOCKMAN_HOST } from 'config/nfts'
import { displayBalance } from 'utils/display'

export const Wrapper = styled.div`
  .nft-list__wrapper {
    margin-top: 24px;
    padding: 0px 50px;
  }
  .nft-list__wrapper div::-webkit-scrollbar {
    display: none;
  }
  .nft-list__collection {
    box-sizing: border-box;
    padding: 32px;
    /* width: 1340px; */
    border-radius: 8px;
    height: 144px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #1c1c1e;
    border: 1px solid #3a3a3c;
    overflow: hidden;
  }
  .nft-list__collection-total-box {
    flex-shrink: 0;
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
    flex: 1;
    overflow-x: auto;
    /* width: 900px; */
    height: 52px;
  }
  .nft-list__table {
    overflow-x: auto;
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
      {/* <div className="sensei__arrow-box" onClick={onClick}> */}
      {/*  <div className={`sensei__arrow sensei__arrow-up ${upClassName}`} /> */}
      {/*  <div className={`sensei__arrow sensei__arrow-down ${downClassName}`} /> */}
      {/* </div> */}
    </SortButtonWrapper>
  )
}

export default function SGTList() {
  const router = useRouter()
  const { id } = router.query

  const { data: collection } = useQuery({
    queryKey: ['collectionDetail', id],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/collection/detail?id=${id}`).then((r) => r.json())
    },
    enabled: !!id,
  })

  const { data } = useQuery({
    queryKey: ['nfts', id],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/nft?page_number=1&page_size=10&collection_id=${id}&sort_type=price_increase`).then(
        (r) => r.json(),
      )
    },
    enabled: !!id,
  })
  const nfts = data?.data
  console.log(nfts)

  const _columns = [
    {
      name: 'NFT',
      sortType: 'none',
      style: {
        width: '140px',
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
        width: '180px',
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

  const [columns, setColumns] = useState(_columns)

  return (
    <Container>
      <Wrapper>
        <div className="nft-list__wrapper">
          <Card p="20px">
            <Row alignItems="center">
              <Flex mr="30px">
                <img
                  src={collection?.collection_avatar ?? DEFAULT_COLLECTION_AVATAR}
                  alt="avatar"
                  width={68}
                  height={68}
                />
                <Box ml="10px" mr="30px" mt="20px">
                  <Text fontSize="18px">{collection?.collection_name}</Text>
                </Box>
              </Flex>
              <AutoRow>
                <Box width="140px">
                  <Text color="textSubtle" mb="2px">
                    Floor Price
                  </Text>
                  <AutoRow gap="4px">
                    <Text>0.00</Text>
                    <AceIcon />
                  </AutoRow>
                </Box>
                <Box width="140px">
                  <Text color="textSubtle" mb="2px">
                    Top BID
                  </Text>
                  <AutoRow gap="4px">
                    <Text>0.00</Text>
                    <AceIcon />
                  </AutoRow>
                </Box>
                <Box width="140px">
                  <Text color="textSubtle" mb="2px">
                    Owners
                  </Text>
                  <Text>{collection?.collection_owners}</Text>
                </Box>
                <Box width="140px">
                  <Text color="textSubtle" mb="2px">
                    Supply
                  </Text>
                  <Text>{collection?.supply}</Text>
                </Box>
                <Box width="140px">
                  <Text color="textSubtle" mb="2px">
                    1D Volume
                  </Text>
                  <AutoRow gap="4px">
                    <Text>0.00</Text>
                    <AceIcon />
                  </AutoRow>
                </Box>
                <Box>
                  <Text color="textSubtle" mb="2px">
                    3D Volume
                  </Text>
                  <AutoRow gap="4px">
                    <Text>0.00</Text>
                    <AceIcon />
                  </AutoRow>
                </Box>
              </AutoRow>
            </Row>
          </Card>
          <div className="sensei__table nft-list__table" style={{ marginTop: '24px' }}>
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
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="sensei__table-body" style={{ marginTop: '20px', gap: '8px' }}>
              {nfts?.map((nft) => {
                return (
                  <div
                    className="sensei__table-body-tr sensei__table-body-tr-hover"
                    key={nft?.id}
                    style={{
                      height: '72px',
                    }}
                  >
                    <div style={columns[0].style} className="sensei__table-body-td">
                      <img
                        className="nft-list__game-image"
                        width={56}
                        height={56}
                        src={nft?.image ?? DEFAULT_NFT_IMAGE}
                        alt="avatar"
                      />
                      <div className="nft-list__game-name">#{nft?.token_id}</div>
                    </div>
                    <div style={columns[1].style} className="sensei__table-body-td">
                      {nft.rarity}
                    </div>
                    <Row className="" gap="8px" justifyContent="flex-end">
                      {nft?.price ? (
                        <>
                          {nft.price}
                          <AceIcon />
                        </>
                      ) : (
                        '-'
                      )}
                    </Row>
                    <Row className="" gap="8px" justifyContent="flex-end">
                      {nft.last_sale_price ? (
                        <>
                          {displayBalance(nft.last_sale_price ?? 0)}
                          <AceIcon />
                        </>
                      ) : (
                        '-'
                      )}
                    </Row>
                    <Row className="" gap="8px" justifyContent="flex-end">
                      {nft.top_bid ? (
                        <>
                          {nft.top_bid}
                          <AceIcon />
                        </>
                      ) : (
                        '-'
                      )}
                    </Row>
                    <Row justifyContent="flex-end">{ellipseAddress(nft.owner, 5)}</Row>
                    <Row justifyContent="flex-end">
                      <Button scale="sm" onClick={() => router.push(`/nfts/detail/${nft?.id}`)}>
                        Buy
                      </Button>
                    </Row>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Wrapper>
    </Container>
  )
}
