import React, { useState } from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { ArrowBackIcon, ArrowForwardIcon, Box, IconButton, Text, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { isAddress } from 'utils'
import { pancakeBunniesAddress } from '../../constants'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import useAllPancakeBunnyNfts from '../../hooks/useAllPancakeBunnyNfts'

import 'swiper/swiper-bundle.css'

const INITIAL_SLIDE = 4

const SwiperCircle = styled.div<{ isActive }>`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.textDisabled)};
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 50%;
  cursor: pointer;
`

const StyledSwiper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    .swiper-wrapper {
      max-height: 390px;
    }
  }
`

interface MoreFromThisCollectionProps {
  collectionAddress: string
  currentTokenName?: string
  title?: string
}

const MoreFromThisCollection: React.FC<MoreFromThisCollectionProps> = ({
  collectionAddress,
  currentTokenName = '',
  title = 'More from this collection',
}) => {
  const { t } = useTranslation()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const { isMobile, isMd, isLg } = useMatchBreakpoints()
  const allPancakeBunnyNfts = useAllPancakeBunnyNfts(collectionAddress)

  let nftsToShow = allPancakeBunnyNfts ? allPancakeBunnyNfts.filter((nft) => nft.name !== currentTokenName) : []

  if (nftsToShow.length === 0) {
    return null
  }

  let slidesPerView = 4
  let maxPageIndex = 3

  if (isMd) {
    slidesPerView = 2
    maxPageIndex = 6
  }

  if (isLg) {
    slidesPerView = 3
    maxPageIndex = 4
  }

  if (isAddress(collectionAddress) === pancakeBunniesAddress) {
    // PancakeBunnies should display 1 card per bunny id
    nftsToShow = nftsToShow.reduce((nftArray, current) => {
      const bunnyId = current.attributes[0].value
      if (!nftArray.find((nft) => nft.attributes[0].value === bunnyId)) {
        nftArray.push(current)
      }
      return nftArray
    }, [])
  }
  nftsToShow = nftsToShow.slice(0, 12)

  const nextSlide = () => {
    if (activeIndex < maxPageIndex - 1) {
      setActiveIndex(activeIndex + 1)
      swiperRef.slideNext()
    }
  }

  const previousSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
      swiperRef.slidePrev()
    }
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index / slidesPerView)
    swiperRef.slideTo(index)
  }

  const updateActiveIndex = ({ activeIndex: newActiveIndex }) => {
    if (newActiveIndex !== undefined) setActiveIndex(Math.ceil(newActiveIndex / slidesPerView))
  }

  return (
    <Box pt="56px" mb="52px">
      {title && (
        <Text bold mb="24px">
          {t(title)}
        </Text>
      )}
      {isMobile ? (
        <StyledSwiper>
          <Swiper spaceBetween={16} slidesPerView={1.5}>
            {nftsToShow.map((nft) => (
              <SwiperSlide key={nft.tokenId}>
                <CollectibleLinkCard nft={nft} />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      ) : (
        <StyledSwiper>
          <Swiper
            onSwiper={setSwiperRef}
            onActiveIndexChange={updateActiveIndex}
            spaceBetween={16}
            slidesPerView={slidesPerView}
            slidesPerGroup={slidesPerView}
            initialSlide={INITIAL_SLIDE}
          >
            {nftsToShow.map((nft) => (
              <SwiperSlide key={nft.tokenId}>
                <CollectibleLinkCard nft={nft} />
              </SwiperSlide>
            ))}
          </Swiper>
          <Flex mt="16px" alignItems="center" justifyContent="center">
            <IconButton variant="text" onClick={previousSlide}>
              <ArrowBackIcon />
            </IconButton>
            {[...Array(maxPageIndex).keys()].map((index) => (
              <SwiperCircle
                key={index}
                onClick={() => goToSlide(index * slidesPerView)}
                isActive={activeIndex === index}
              />
            ))}
            <IconButton variant="text" onClick={nextSlide}>
              <ArrowForwardIcon />
            </IconButton>
          </Flex>
        </StyledSwiper>
      )}
    </Box>
  )
}

export default MoreFromThisCollection
