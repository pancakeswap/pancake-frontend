'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Activity from './component/activity'
import Adventure from './component/adventure'
import Offer from './component/offer'

import defaultGame from '../../../../public/images/nfts2/game.png'
import sgtIcon from '../../../../public/images/nfts2/sgt-icon.png'
import Tag from '../../../components/Tag/tag'
import { getSgtDetail } from '../api/sgt'
import { Wrapper } from './index.style'

export default function SGTDetail() {
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
          <Image src={defaultGame} alt="game" className="sgt-detail__left-image" />
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
            <div className="sgt-detail__left-detail-desc">
              Anya was a subject in a secret and morally unethical experiment that aimed to create children with psychic
              abilities. As a result, she gained telepathic abilities.Anya was a subject in a secret and morally
              unethical experiment that aimed to create children with psychic abilities. As a result, she gained
              telepathic abilities.
            </div>
            {[
              {
                label: 'Contract adress',
                value: '0xc41...',
              },
              {
                label: 'Created',
                value: '3 months ago',
              },
              {
                label: 'Token ID',
                value: '#2761',
              },
              {
                label: 'Last Updated',
                value: '2 years ago',
              },
              {
                label: 'Metadata',
                value: 'Https://Tori.whekwwekwwekww',
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
              <Adventure />
            </div>
            <div className="sgt-detail__right-block">
              <div className="sgt-detail__right-block-title">Offer</div>
              <Offer />
            </div>
            <div className="sgt-detail__right-block">
              <div className="sgt-detail__right-block-title">Activity</div>
              <Activity />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
