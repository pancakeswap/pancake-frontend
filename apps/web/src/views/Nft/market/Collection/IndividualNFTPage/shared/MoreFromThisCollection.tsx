import { ArrowBackIcon, ArrowForwardIcon, Box, Flex, IconButton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import Trans from 'components/Trans'
import shuffle from 'lodash/shuffle'
import { ReactNode, useMemo, useState } from 'react'
import { getMarketDataForTokenIds, getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
import { styled } from 'styled-components'
import type SwiperCore from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'
import { CollectibleLinkCard } from '../../../components/CollectibleCard'
import { pancakeBunniesAddress } from '../../../constants'
import useAllPancakeBunnyNfts from '../../../hooks/useAllPancakeBunnyNfts'

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
  collectionAddress?: string
  currentTokenName?: string
  title?: ReactNode
}

const MoreFromThisCollection: React.FC<React.PropsWithChildren<MoreFromThisCollectionProps>> = ({
  collectionAddress,
  currentTokenName = '',
  title = <Trans>More from this collection</Trans>,
}) => {
  const [swiperRef, setSwiperRef] = useState<SwiperCore | null>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const { isMobile, isMd, isLg } = useMatchBreakpoints()
  const allPancakeBunnyNfts = useAllPancakeBunnyNfts(collectionAddress)

  const isPBCollection = safeGetAddress(collectionAddress) === safeGetAddress(pancakeBunniesAddress)
  const checkSummedCollectionAddress = safeGetAddress(collectionAddress) || collectionAddress

  const { data: collectionNfts } = useQuery({
    queryKey: ['nft', 'moreFromCollection', checkSummedCollectionAddress],
    queryFn: async () => {
      try {
        const nfts = await getNftsFromCollectionApi(collectionAddress!, 100, 1)

        if (!nfts?.data) {
          return []
        }

        const tokenIds = Object.values(nfts.data)
          .map((nft) => nft.tokenId)
          .filter(Boolean) as string[]
        const nftsMarket = await getMarketDataForTokenIds(collectionAddress!, tokenIds)

        return tokenIds.map((id) => {
          const apiMetadata = nfts.data[id]
          const marketData = nftsMarket.find((nft) => nft.tokenId === id)

          return {
            tokenId: id,
            name: apiMetadata.name,
            description: apiMetadata.description,
            collectionName: apiMetadata.collection.name,
            collectionAddress: collectionAddress as Address,
            image: apiMetadata.image,
            attributes: apiMetadata.attributes,
            marketData,
          }
        })
      } catch (error) {
        console.error(`Failed to fetch collection NFTs for ${collectionAddress}`, error)
        return []
      }
    },
    enabled: Boolean(!isPBCollection && checkSummedCollectionAddress),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const nftsToShow = useMemo(() => {
    let shuffled = shuffle(
      allPancakeBunnyNfts
        ? allPancakeBunnyNfts.filter((nft) => nft.name !== currentTokenName)
        : collectionNfts
        ? collectionNfts.filter((nft) => nft.name !== currentTokenName && nft.marketData?.isTradable)
        : [],
    ) as NftToken[]

    if (isPBCollection) {
      // PancakeBunnies should display 1 card per bunny id
      shuffled = shuffled.reduce((nftArray, current) => {
        const bunnyId = current?.attributes?.[0].value
        if (!nftArray.find((nft) => nft?.attributes?.[0].value === bunnyId)) {
          nftArray.push(current)
        }
        return nftArray
      }, [] as NftToken[])
    }
    return shuffled.slice(0, 12)
  }, [allPancakeBunnyNfts, collectionNfts, currentTokenName, isPBCollection])

  const [slidesPerView, maxPageIndex] = useMemo(() => {
    let slides
    let extraPages = 1
    if (isMd) {
      slides = 2
    } else if (isLg) {
      slides = 3
    } else {
      slides = 4
    }
    if (nftsToShow.length % slides === 0) {
      extraPages = 0
    }
    const maxPage = Math.max(Math.floor(nftsToShow.length / slides) + extraPages, 1)
    return [slides, maxPage]
  }, [isMd, isLg, nftsToShow?.length])

  if (!nftsToShow || nftsToShow.length === 0) {
    return null
  }

  const nextSlide = () => {
    if (activeIndex < maxPageIndex - 1) {
      setActiveIndex((index) => index + 1)
      swiperRef?.slideNext()
    }
  }

  const previousSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((index) => index - 1)
      swiperRef?.slidePrev()
    }
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index / slidesPerView)
    swiperRef?.slideTo(index)
  }

  const updateActiveIndex = ({ activeIndex: newActiveIndex }) => {
    if (newActiveIndex !== undefined) setActiveIndex(Math.ceil(newActiveIndex / slidesPerView))
  }

  return (
    <Box pt="56px" mb="52px">
      {title && (
        <Text bold mb="24px">
          {title}
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
                <CollectibleLinkCard
                  nft={nft}
                  currentAskPrice={
                    isPBCollection
                      ? undefined
                      : nft?.marketData?.currentAskPrice
                      ? parseFloat(nft?.marketData?.currentAskPrice)
                      : undefined
                  }
                />
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
