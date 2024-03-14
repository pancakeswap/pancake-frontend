'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ellipseAddress } from 'utils/address'
import dayjs from 'dayjs'
import { styled } from 'styled-components'
import { DEFAULT_NFT_IMAGE, DOCKMAN_HOST } from 'config/nfts'
import List from 'components/nfts/component/list'
import { AceIcon, AutoRow, Box, Card, Column, Container, Flex, Loading, Text } from '@pancakeswap/uikit'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getBlockExploreLink } from 'utils'
import { ChainId } from '@pancakeswap/chains'
import Activity from '../../../components/nfts/component/activity'
import Adventure from '../../../components/nfts/component/adventure'
import Offer from '../../../components/nfts/component/offer'
import Tag from '../../../components/Tag/tag'

dayjs.extend(relativeTime)

const MetaBlock = styled.div`
  border-radius: 8px;
  background: #2c2c2c;
  padding: 16px 20px;
`

export const Wrapper = styled.div`
  .sgt-detail__wrapper div::-webkit-scrollbar {
    display: none;
  }
  .sgt-detail__wrapper {
    padding: 24px 24px 36px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    color: #fff;
  }
  .sgt-detail__left {
    position: relative;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 22px 16px 16px;
    width: 604px;
    flex-shrink: 1;
    border: 1px solid rgba(58, 58, 60, 1);
    border-radius: 8px;
  }

  .sgt-detail__left-image-box {
    border: 1px solid rgba(74, 74, 76, 1);
    border-radius: 8px;
    width: 100%;
  }
  .sgt-detail__left-image {
    overflow: hidden;
    width: 100%;
    height: auto;
    border: 1px solid rgba(74, 74, 76, 1);
    border-radius: 8px;
  }

  .sgt-detail__left-trait-box {
    margin-top: 16px;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 16px 20px;
    background-color: #2c2c2e;
    /* width: 572px; */
  }
  .sgt-detail__left-trait-title-box {
    font-size: 16px;
    line-height: 24px;
    height: 24px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  .sgt-detail__left-trait-title {
    color: white;
  }
  .sgt-detail__left-trait-title-value {
    color: rgba(255, 255, 255, 0.48);
  }
  .sgt-detail__left-trait-list {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
  }
  .sgt-detail__left-trait-item {
    min-width: 166px;
    height: 104px;
    display: flex;
    padding-top: 12px;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 4px;
    border-radius: 4px;
    background: #3a3a3c;
  }
  .sgt-detail__left-trait-item-title {
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.72);
  }
  .sgt-detail__left-trait-item-short-box {
    font-size: 16px;
    line-height: 24px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    color: rgba(255, 255, 255, 0.95);
  }
  /* .sgt-detail__left-trait-item-short-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  color: rgba(255, 255, 255, 0.72);
} */
  .sgt-detail__left-trait-item-floor-box {
    font-size: 16px;
    line-height: 24px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    color: rgba(255, 255, 255, 0.72);
  }

  .sgt-detail__left-detail-box {
    margin-top: 16px;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 16px 24px 16px;
    background-color: #2c2c2e;
    /* width: 572px; */
  }
  .sgt-detail__left-detail-title-box {
    font-size: 16px;
    line-height: 24px;
    height: 24px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  .sgt-detail__left-detail-title {
    color: white;
  }
  .sgt-detail__left-detail-line-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
    height: 21px;
    gap: 24px;
  }
  .sgt-detail__left-detail-line-babel {
    width: 114px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 14px;
    line-height: 21px;
  }
  .sgt-detail__left-detail-line-value {
    color: rgba(255, 255, 255, 0.95);
    font-size: 14px;
    line-height: 21px;
  }

  /* right */
  .sgt-detail__right {
    width: 780px;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 16px;
    width: 780px;
    /* flex: 8; */
    flex-shrink: 1;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 1);
    border: 1px solid rgba(58, 58, 60, 1);
    border-radius: 8px;
    background-color: rgba(28, 28, 30, 1);
  }
  .sgt-detail__right-block {
    margin-bottom: 16px;
    padding: 16px 20px;
    border-radius: 8px;
    background: #2c2c2e;
  }
  .sgt-detail__right-block-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  .sgt-detail__modal-label {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #fff;
  }
  .modal-label__modal-conclusion {
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
  .modal-label__modal-available-box {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }
  .modal-label__modal-available-value {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
  }
  .modal-label__modal-available-unit {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
  .modal-label__modal-total-box {
    display: flex;
    flex-direction: row;
    height: 24px;
    gap: 8px;
  }
  .modal-label__modal-total-label {
    font-size: 14px;
    line-height: 21px;
    color: rgba(255, 255, 255, 0.72);
  }
  .modal-label__modal-total-value {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #fff;
  }
  .modal-label__modal-line {
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.48);
  }
`
export default function SGTDetail() {
  const router = useRouter()
  const { id } = router.query

  const { data: nft } = useQuery({
    queryKey: ['nftDetail', id],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/nft/detail?nft_id=${id}`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!id,
  })

  const { data: offers, refetch: refetchOffers } = useQuery({
    queryKey: ['nftOffers', id],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/orders?chain_id=648&nft_id=${id}&order_market_type=Offer`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!id,
  })

  const { data: list, refetch: refetchList } = useQuery({
    queryKey: ['nftList', id],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/orders?chain_id=648&nft_id=${id}&order_market_type=List`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!id,
  })

  const { data: activitiesD, refetch: refetchActivities } = useQuery({
    queryKey: ['nftActivities', id],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST}/nft/activity?page_number=1&page_size=10&nft_id=${id}`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!id,
  })
  const activities = activitiesD?.data

  console.log(nft)
  if (!nft) {
    return (
      <Flex alignItems="center" justifyContent="center" py="40px">
        <Loading color="primary" width="30px" height="30px" />
      </Flex>
    )
  }

  return (
    <Container>
      <Wrapper>
        <div className="sgt-detail__wrapper">
          <div className="sgt-detail__left">
            <img
              src={nft?.nft_image ? nft?.nft_image : DEFAULT_NFT_IMAGE}
              alt="game"
              className="sgt-detail__left-image"
            />
            <div className="sgt-detail__left-trait-box">
              <div className="sgt-detail__left-trait-title-box">
                <Text fontWeight={600} fontSize="18px">
                  Traits
                </Text>
                <div className="sgt-detail__left-trait-title-value">{nft?.trails?.length}</div>
              </div>
              <div className="sgt-detail__left-trait-list">
                {nft?.traits?.map((trait) => {
                  return (
                    <div key={trait?.trait_type} className="sgt-detail__left-trait-item">
                      <div className="sgt-detail__left-trait-item-title">{trait?.trait_type}</div>
                      <div className="sgt-detail__left-trait-item-short-box">
                        {trait?.value}
                        <Tag color="rgba(255, 204, 71, 1)" bgColor="rgba(255, 204, 71, .12)">
                          {Math.floor((100 * trait?.numerator) / trait?.denominator)}%
                        </Tag>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="sgt-detail__left-detail-box">
              <div className="sgt-detail__left-detail-title-box">
                <Text fontWeight={600} fontSize="18px">
                  Details
                </Text>
              </div>
              <Text color="textSubtle">{nft?.nft_description}</Text>
              <Box height={1} background="#444444" my={3} />
              {[
                {
                  label: 'Contract address',
                  value: (
                    <Link href={getBlockExploreLink(nft?.collection_contract_address, 'address', ChainId.ENDURANCE)}>
                      {ellipseAddress(nft?.collection_contract_address)}
                    </Link>
                  ),
                },
                {
                  label: 'Created',
                  value: dayjs(nft?.create_at).fromNow(),
                },
                {
                  label: 'Token ID',
                  value: `#${nft?.token_id}`,
                },
                {
                  label: 'Last Updated',
                  value: dayjs(nft?.last_updated).fromNow(),
                },
                {
                  label: 'Metadata',
                  value: (
                    <Link href={nft?.metadata} target="_blank">
                      {ellipseAddress(nft?.metadata, 10)}
                    </Link>
                  ),
                },
              ].map((item) => {
                return (
                  <AutoRow key={item?.label} justifyContent="space-between" mb="12px">
                    <div className="sgt-detail__left-detail-line-babel">{item.label}</div>
                    <div className="sgt-detail__left-detail-line-value">{item.value}</div>
                  </AutoRow>
                )
              })}
            </div>
          </div>
          <div className="sgt-detail__right">
            <Column gap="20px">
              <MetaBlock>
                <Adventure
                  nft={nft}
                  refetch={() => {
                    setTimeout(() => {
                      refetchActivities()
                      refetchOffers()
                      refetchList()
                    }, 1500)
                  }}
                />
              </MetaBlock>
              <MetaBlock>
                <Text fontWeight={600} fontSize="18px" mb="10px">
                  Offer
                </Text>
                <Offer offers={offers} nft={nft} />
              </MetaBlock>
              <MetaBlock>
                <Text fontWeight={600} fontSize="18px" mb="10px">
                  List
                </Text>
                <List
                  list={list}
                  refetch={() => {
                    setTimeout(() => {
                      refetchActivities()
                      refetchOffers()
                      refetchList()
                    }, 1500)
                  }}
                />
              </MetaBlock>
              <MetaBlock>
                <Text fontWeight={600} fontSize="18px" mb="10px">
                  Activity
                </Text>
                <Activity activities={activities} />
              </MetaBlock>
            </Column>
          </div>
        </div>
      </Wrapper>
    </Container>
  )
}
