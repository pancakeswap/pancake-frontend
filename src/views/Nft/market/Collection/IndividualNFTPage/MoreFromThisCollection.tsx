import React from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination } from 'swiper'
import { Box, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import { pancakeBunniesAddress } from '../../constants'
import { CollectibleLinkCard } from '../../components/CollectibleCard'

import 'swiper/swiper-bundle.css'

SwiperCore.use([Pagination])

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    .swiper-container {
      padding-bottom: 48px;
    }

    .swiper-slide {
      max-height: 377px;
    }
  }
`

interface MoreFromThisCollectionProps {
  currentTokenName: string
}

const MoreFromThisCollection: React.FC<MoreFromThisCollectionProps> = ({ currentTokenName }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const nftList = useNftsFromCollection(pancakeBunniesAddress)

  if (!nftList) {
    return null
  }

  const nftsToShow = nftList.filter((nft) => nft.name !== currentTokenName).slice(0, 12)

  return (
    <Box pt="56px" pb="32px" mb="52px">
      <Text bold mb="24px">
        {t('More from this collection')}
      </Text>
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
            spaceBetween={16}
            slidesPerView={4}
            slidesPerGroup={4}
            initialSlide={4}
            pagination={{
              clickable: true,
            }}
          >
            {nftsToShow.map((nft) => (
              <SwiperSlide key={nft.tokenId}>
                <CollectibleLinkCard nft={nft} />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      )}
    </Box>
  )
}

export default MoreFromThisCollection
