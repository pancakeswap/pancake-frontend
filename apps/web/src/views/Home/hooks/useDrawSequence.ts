import { useLayoutEffect, useState, useCallback, useRef } from 'react'

export const useDrawSequenceImages = (
  imagePath: string,
  imageCount: number,
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
  onplayEnd: () => void,
  autoPlay?: () => void,
  loop?: boolean,
) => {
  const ImageLoadedCount = useRef(0)
  const images = useRef<HTMLImageElement[]>([])
  const canvas = canvasRef?.current
  const ImageDrawProgress = useRef(0)

  const drawSequenceImage = useCallback(
    (width: number, height: number) => {
      if (!canvas || ImageDrawProgress.current + 1 >= imageCount) return
      if (ImageDrawProgress.current === 0) {
        canvas.width = width
        canvas.height = height
      }
      const context = canvas.getContext('2d')
      if (ImageDrawProgress.current + 1 >= imageCount) {
        onplayEnd()
      } else {
        if (images.current[ImageDrawProgress.current]) {
          context.clearRect(0, 0, width, height)
          context.drawImage(images.current[ImageDrawProgress.current], 0, 0, width, height)
        }
        ImageDrawProgress.current++
        if (loop && ImageDrawProgress.current + 1 >= imageCount) {
          ImageDrawProgress.current = 0
        }
      }
    },
    [canvas, imageCount, onplayEnd, loop],
  )

  useLayoutEffect(() => {
    for (let i = 0; i < imageCount; i++) {
      const image = new Image()
      image.src = `${imagePath}/${i}.png`
      image.onload = () => {
        ImageLoadedCount.current++
        images.current[i] = image
        if (ImageLoadedCount.current === imageCount && autoPlay) {
          autoPlay()
        }
      }
    }
  }, [imageCount, imagePath, autoPlay])

  return drawSequenceImage
}
