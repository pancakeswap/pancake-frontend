/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import { BaseLayout, Box, Flex, Image, LinkExternal, Modal, Slider, Text } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { auctionById, bnbPriceUsd } from '../../redux/get'
import { getBalanceAmount } from '../../utils/formatBalance'

interface PrizeModalProps {
  id: number
  onDismiss?: () => void
  setSwiper: any
}

const TableCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
  }

  .swiper-slide {
    width: 320px;
  }
`

const PrizeModal: React.FC<PrizeModalProps> = ({ id, setSwiper, onDismiss }) => {
  const {
    prize,
    prizeDescription,
    path,
    version,
    additionalDetails,
    artist: { twitter },
    auctionInfo: { unlockFeeInBnb },
  } = auctionById(id)

  const { theme } = useTheme()

  return <Modal onDismiss={onDismiss} title={prize} headerBackground={theme.colors.backgroundAlt}
                style={{ width: '95%', maxHeight: '90%', overflowY: 'scroll' }}>
    <StyledSwiper style={{ width: '100%' }}>
      <Swiper
        initialSlide={1}
        onSwiper={setSwiper}
        spaceBetween={16}
        slidesPerView='auto'
        freeMode
        direction='vertical'
        freeModeSticky
        centeredSlides
        mousewheel
        keyboard
        resizeObserver
      >
        <SwiperSlide>
          <TableCards>
          <div className='table-bottom'>
            <div className='w-95 mx-auto mt-3'>
              <div className='flex-grow'>
                <div className='rug-indetails'>
                  <div className='direction-column'>
                    <div className='sc-iwajpm dcRUtg'>
                      <img src={path} alt='PRIZE' />
                    </div>
                  </div>
                  <div className='direction-column'>
                    <span className='indetails-type'>{prize}</span>
                    <br />
                    <span className='indetails-title'>
                    Prize Details:
                  <span className='indetails-value'>
                    {prizeDescription}
                  </span>
                  </span>
                    <br />
                    <span className='indetails-title'>
                    <LinkExternal bold={false} small href={twitter}>
                      View NFT Artist
                    </LinkExternal>
                  </span>
                  </div>
                  {additionalDetails ? additionalDetails.map(details => {
                    return <>
                      <LinkExternal href={details.url}>
                        <br />
                        {details.name}
                      </LinkExternal>
                      <br />
                    </>
                  }) : null}
                  {version !== 'v3' ?
                    <div className='direction-column'>
                   <span className='indetails-type'>Unlock Fees: {getBalanceAmount(unlockFeeInBnb).toString()} BNB
                    ({Math.round(getBalanceAmount(unlockFeeInBnb).times(bnbPriceUsd()).toNumber() * 100) / 100} in USD)
                   </span>
                    </div> : null}
                </div>
              </div>
            </div>
          </div>
        </TableCards>
      </SwiperSlide>

    </Swiper>
    </StyledSwiper>
  </Modal>
}

export default PrizeModal
