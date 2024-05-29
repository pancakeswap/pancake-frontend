import { useIntersectionObserver } from '@pancakeswap/hooks'
import { Box, BoxProps, Image } from '@pancakeswap/uikit'
import { NftToken } from 'hooks/useProfile/nft/types'
import { atom, useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from 'state'
import { styled } from 'styled-components'
import { useNftStorage } from '../hooks/useNftStorage'

const StyledAspectRatio = styled(Box)`
  position: absolute;
  inset: 0;
`

const RoundedImage = styled(Image)`
  height: max-content;
  border-radius: ${({ theme }) => theme.radii.default};
  overflow: hidden;
  & > img {
    object-fit: contain;
  }
`

const tryVideoNftMediaAtom = atom(true)
const useTryVideoNftMedia = () => {
  const [tryVideoNftMedia] = useAtom(tryVideoNftMediaAtom)
  return tryVideoNftMedia ?? true
}

export const AspectRatio = ({ ratio, children, ...props }: any) => (
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
