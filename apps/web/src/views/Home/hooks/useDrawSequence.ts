import { useCallback, useRef } from 'react'
import { useIsomorphicEffect } from '@pancakeswap/uikit'

export const useDrawSequenceImages = (
  imagePath: string,
  imageCount: number,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  intervalRef: React.MutableRefObject<number>,
  onplayEnd: () => void,
  autoPlay?: () => void,
  loop?: boolean,
) => {
  const ImageLoadedCount = useRef(0)
  const images = useRef<HTMLImageElement[]>([])
  const ImageDrawProgress = useRef(0)

  const playing = useRef(false)

  const drawSequenceImage = useCallback(
    (width: number, height: number) => {
      const canvas = canvasRef.current
      if (!canvas || ImageDrawProgress.current + 1 >= imageCount) return
      const context = canvas.getContext('2d')
      if (ImageDrawProgress.current + 1 >= imageCount) {
        clearInterval(intervalRef.current)
        onplayEnd()
      } else {
        if (images.current[ImageDrawProgress.current]) {
          context?.clearRect(0, 0, width, height)
          context?.drawImage(images.current[ImageDrawProgress.current], 0, 0, width, height)
        }
        ImageDrawProgress.current++
        if (loop && ImageDrawProgress.current + 1 >= imageCount) {
          ImageDrawProgress.current = 0
        }
      }
    },
    [canvasRef, imageCount, onplayEnd, loop, intervalRef],
  )

  useIsomorphicEffect(() => {
    for (let i = 0; i < imageCount; i++) {
      const image = new Image()
      image.src = `${imagePath}/${i}.png`
      image.onload = () => {
        ImageLoadedCount.current++
        images.current[i] = image
        if (ImageLoadedCount.current + 3 >= imageCount && autoPlay) {
          if (playing.current === false) {
            autoPlay()
          }
        }
      }
    }
  }, [imageCount, imagePath, autoPlay, playing])

  return { drawSequenceImage, playing }
}
