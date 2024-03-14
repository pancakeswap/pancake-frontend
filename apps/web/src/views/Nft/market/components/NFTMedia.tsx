import { useIntersectionObserver } from '@pancakeswap/hooks'
import { Box, BoxProps } from '@pancakeswap/uikit'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from 'state'
import { useTryVideoNftMedia } from 'state/nftMarket/hooks'
import { useNftStorage } from 'state/nftMarket/storage'
import { NftToken } from 'state/nftMarket/types'
import { styled } from 'styled-components'
import { RoundedImage } from '../Collection/IndividualNFTPage/shared/styles'

const StyledAspectRatio = styled(Box)`
  position: absolute;
  inset: 0;
`

export const AspectRatio = ({ ratio, children, ...props }) => (
  <Box width="100%" height={0} pb={`${100 / ratio}%`} position="relative" {...props}>
    <StyledAspectRatio>{children}</StyledAspectRatio>
  </Box>
)

const NFTMedia: React.FC<
  React.PropsWithChildren<
    {
      nft?: NftToken
      as?: any
      width: number
      height: number
    } & Omit<BoxProps, 'width' | 'height' | 'as'>
  >
> = ({ width, height, nft, borderRadius = 'default', as, ...props }) => {
  const dispatch = useAppDispatch()
  const { setTryVideoNftMedia } = useNftStorage()
  const tryVideoNftMedia = useTryVideoNftMedia()
  const vidRef = useRef<HTMLVideoElement>(null)
  const { observerRef, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (vidRef.current) {
      if (isIntersecting) {
        vidRef.current.play().catch((error) => {
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            setTryVideoNftMedia(false)
          }
        })
      } else {
        vidRef.current.pause()
      }
    }
  }, [dispatch, isIntersecting, setTryVideoNftMedia])

  if (tryVideoNftMedia && (nft?.image.webm || nft?.image.mp4)) {
    return (
      <AspectRatio ratio={width / height} {...props}>
        <div ref={observerRef} />
        <Box ref={vidRef} borderRadius={borderRadius} as="video" width="100%" height="100%" muted loop playsInline>
          <source src={nft.image.webm} type="video/webm" />
          <source src={nft.image.mp4} type="video/mp4" />
        </Box>
      </AspectRatio>
    )
  }

  return (
    <RoundedImage
      width={width}
      height={height}
      src={nft?.image.gif || nft?.image.thumbnail}
      alt={nft?.name}
      as={as}
      {...props}
    />
  )
}

export default NFTMedia
