/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { useState } from 'react'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AceIcon, AutoRow, Box, Button, Card, Column, Container, Flex, Loading, Row, Text } from '@pancakeswap/uikit'
import { ellipseAddress } from 'utils/address'
import { DEFAULT_COLLECTION_AVATAR, DEFAULT_NFT_IMAGE, DOCKMAN_HOST } from 'config/nfts'
import { displayBalance } from 'utils/display'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'

const NFTImage = styled.img`
  border: 1px solid #fff;
  border-radius: 4px;
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

const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 30px;
  border-radius: 8px;

  &:hover {
    background: #212121;
  }
`

const ItemsWrapper = styled.div`
  width: 100%;
  overflow-x: scroll;
  display: flex;
  justify-content: center;
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

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [`nfts_${id}`],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `${DOCKMAN_HOST}/nft?page_number=${pageParam + 1}&page_size=20&collection_id=${id}&sort_type=price_increase`,
      ).then((r) => r.json())

      if (res?.statusCode === 500) {
        throw new Error(res?.message)
      }

      return res
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.meta?.currentPage
    },
    initialPageParam: 0,
    enabled: !!id,
  })

  const pages = data?.pages
  const nfts = pages?.reduce((results: any[], ci: any) => {
    results.push(...ci.data)
    return results
  }, [])
  const meta = pages?.[pages?.length - 1]?.meta

  const _columns = [
    {
      name: 'NFT',
      sortType: 'none',
      style: {
        width: '180px',
        justifyContent: 'flex-start',
      },
    },
    {
      name: 'Rarity',
      sortType: 'none',
      style: {
        width: '120px',
        justifyContent: 'center',
      },
    },
    {
      name: 'Price',
      sortType: 'none',
      style: {
        width: '150px',
        justifyContent: 'center',
      },
    },
    {
      name: 'Last Sale',
      sortType: 'none',
      style: {
        width: '150px',
        justifyContent: 'center',
      },
    },

    {
      name: 'Top BID',
      sortType: 'none',
      style: {
        width: '150px',
        justifyContent: 'center',
      },
    },
    {
      name: 'Owners',
      sortType: 'none',
      style: {
        width: '180px',
        justifyContent: 'center',
      },
    },
    {
      name: '',
      sortType: 'none',
      style: {
        paddingLeft: '32px',
        flex: '1',
        justifyContent: 'center',
      },
    },
  ]

  const [columns, setColumns] = useState(_columns)

  if (!nfts || !collection) {
    return (
      <Flex alignItems="center" justifyContent="center" py="40px">
        <Loading color="primary" width="30px" height="30px" />
      </Flex>
    )
  }

  console.log(nfts)

  return (
    <InfiniteScroll
      dataLength={nfts?.length ?? 0}
      hasMore={!meta?.isLastPage}
      loader={
        <Flex alignItems="center" justifyContent="center" py={4}>
          <Loading />
        </Flex>
      }
      next={fetchNextPage}
      style={{ overflow: 'hidden' }}
    >
      <Container>
        <Box pt="20px" pb="40px">
          <div className="nft-list__wrapper">
            <Card p="20px" mb="20px">
              <Row alignItems="center">
                <Flex mr="30px">
                  <Box width="80px" ml="5px">
                    <img
                      src={collection?.collection_avatar ?? DEFAULT_COLLECTION_AVATAR}
                      alt="avatar"
                      style={{ width: '80px', height: '80px' }}
                    />
                  </Box>
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
            <ItemsWrapper>
              <Column alignItems="center">
                <div className="sensei__table-header" style={{ width: '100%', padding: '0 30px' }}>
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
                <Column style={{ marginTop: '20px', gap: '8px', width: '100%' }}>
                  {nfts?.map((nft: any) => {
                    return (
                      <ItemLink
                        href={`/nfts/detail/${nft?.id}`}
                        key={nft?.id}
                        style={{
                          filter:
                            nft?.owner === '0x0000000000000000000000000000000000000000' ? 'brightness(0.8)' : 'none',
                        }}
                      >
                        <Flex flexShrink={0} alignItems="center" width="180px">
                          <NFTImage
                            width={60}
                            height={60}
                            src={nft?.nft_image ? nft?.nft_image : DEFAULT_NFT_IMAGE}
                            alt="avatar"
                          />
                          <Text fontSize="13px" ml="10px">
                            {nft?.nft_name ? nft?.nft_name : `#${nft?.token_id}`}
                          </Text>
                        </Flex>
                        <Box width="120px" style={{ textAlign: 'center', flexShrink: 0 }}>
                          {nft.rarity}
                        </Box>
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                          width="150px"
                          style={{ gap: '4px' }}
                        >
                          {nft?.price ? (
                            <>
                              {nft.price}
                              <AceIcon />
                            </>
                          ) : (
                            '-'
                          )}
                        </Flex>
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          width="150px"
                          flexShrink={0}
                          style={{ gap: '4px' }}
                        >
                          {nft.last_sale_price ? (
                            <>
                              {displayBalance(nft.last_sale_price ?? 0)}
                              <AceIcon />
                            </>
                          ) : (
                            '-'
                          )}
                        </Flex>
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          width="150px"
                          flexShrink={0}
                          style={{ gap: '4px' }}
                        >
                          {nft.top_bid ? (
                            <>
                              {displayBalance(nft.top_bid ?? 0)}
                              <AceIcon />
                            </>
                          ) : (
                            '-'
                          )}
                        </Flex>
                        <Flex justifyContent="center" width="180px" flexShrink={0}>
                          {ellipseAddress(nft.owner, 5)}
                        </Flex>
                        <Row justifyContent="flex-end">
                          <Button scale="sm" onClick={() => router.push(`/nfts/detail/${nft?.id}`)}>
                            Trade
                          </Button>
                        </Row>
                      </ItemLink>
                    )
                  })}
                </Column>
              </Column>
            </ItemsWrapper>
          </div>
        </Box>
      </Container>
    </InfiniteScroll>
  )
}
