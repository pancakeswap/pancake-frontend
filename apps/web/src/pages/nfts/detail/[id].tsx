'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ellipseAddress } from 'utils/address'
import dayjs from 'dayjs'
import Activity from './component/activity'
import Adventure from './component/adventure'
import Offer from './component/offer'

import defaultGame from '../../../../public/images/nfts2/game.png'
import sgtIcon from '../../../../public/images/nfts2/sgt-icon.png'
import Tag from '../../../components/Tag/tag'
import { getSgtDetail } from '../api/sgt'
import { Wrapper } from './index.style'

export default function SGTDetail() {
  const router = useRouter()
  const { id } = router.query
  const { data: nft } = useQuery({
    queryKey: ['nftDetail', id],
    queryFn: () => {
      return fetch(`http://10.1.1.100:9000/nft/detail?nft_id=${id}`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!id,
  })
  const { data: offers } = useQuery({
    queryKey: ['nftOffers', id],
    queryFn: () => {
      return fetch(`http://10.1.1.100:9000/orders?chain_id=2015&nft_id=${id}&order_market_type=Offer`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!id,
  })
  const { data: activitiesD } = useQuery({
    queryKey: ['nftActivities', id],
    queryFn: () => {
      return fetch(`http://10.1.1.100:9000/nft/activity?page_number=1&page_size=10&nft_id=${id}`, {
        method: 'GET',
      }).then((r) => r.json())
    },
    enabled: !!id,
  })
  console.log(offers)
  const activities = activitiesD?.data
  console.log(activities)
  const [detail, setDetail] = useState()

  useEffect(() => {
    const init = async () => {
      const res = await getSgtDetail()
      setDetail(res)
    }
    init()
  }, [])
  return (
    <Wrapper>
      <div className="sgt-detail__wrapper">
        <div className="sgt-detail__left">
          <img src={nft?.nft_image} alt="game" className="sgt-detail__left-image" />
          <div className="sgt-detail__left-trait-box">
            <div className="sgt-detail__left-trait-title-box">
              <div className="sgt-detail__left-trait-title">Traits</div>
              <div className="sgt-detail__left-trait-title-value">6</div>
            </div>
            <div className="sgt-detail__left-trait-list">
              {[1, 2, 3, 4, 5, 6].map((item) => {
                return (
                  <div key={item} className="sgt-detail__left-trait-item">
                    <div className="sgt-detail__left-trait-item-title">trait_01</div>
                    <div className="sgt-detail__left-trait-item-short-box">
                      Short
                      <Tag color="rgba(255, 204, 71, 1)" bgColor="rgba(255, 204, 71, .12)">
                        41%
                      </Tag>
                    </div>
                    <div className="sgt-detail__left-trait-item-floor-box">
                      <div>Floor:</div>
                      <div>10.23</div>
                      <Image
                        src={sgtIcon}
                        alt="icon"
                        width={20}
                        height={20}
                        style={{ width: '20px', height: '20px' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="sgt-detail__left-detail-box">
            <div className="sgt-detail__left-detail-title-box">
              <div className="sgt-detail__left-detail-title">NFT Details</div>
            </div>
            <div className="sgt-detail__left-detail-desc">{nft?.nft_description}</div>
            {[
              {
                label: 'Contract adress',
                value: (
                  <Link href={nft?.collection_contract_address ?? ''}>
                    {ellipseAddress(nft?.collection_contract_address)}
                  </Link>
                ),
              },
              {
                label: 'Created',
                value: '3 months ago',
              },
              {
                label: 'Token ID',
                value: `#${nft?.token_id}`,
              },
              {
                label: 'Last Updated',
                value: dayjs(nft?.last_updated).unix(),
              },
              {
                label: 'Metadata',
                value: nft?.metadata,
              },
            ].map((item) => {
              return (
                <div key={item.label} className="sgt-detail__left-detail-line-box">
                  <div className="sgt-detail__left-detail-line-babel">{item.label}</div>
                  <div className="sgt-detail__left-detail-line-value">{item.value}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="sgt-detail__right">
          <div>
            <div className="sgt-detail__right-block">
              <Adventure nft={nft} />
            </div>
            <div className="sgt-detail__right-block">
              <div className="sgt-detail__right-block-title">Offer</div>
              <Offer />
            </div>
            <div className="sgt-detail__right-block">
              <div className="sgt-detail__right-block-title">Activity</div>
              <Activity activities={activities} />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
