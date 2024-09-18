import { useLayoutEffect, useCallback, useRef } from 'react'

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
      if (!canvas || ImageDrawProgress.current >= imageCount) return
      if (ImageDrawProgress.current >= imageCount) {
        clearInterval(intervalRef.current)
        onplayEnd()
      } else {
        const img = images.current[ImageDrawProgress.current]
        if (img && img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0) {
          const context = canvas.getContext('2d')
          context?.clearRect(0, 0, width, height)
          context?.drawImage(img, 0, 0, width, height)
        }
        ImageDrawProgress.current++
        if (loop && ImageDrawProgress.current >= imageCount) {
          ImageDrawProgress.current = 0
        }
      }
    },
    [canvasRef, imageCount, onplayEnd, loop, intervalRef],
  )

  useLayoutEffect(() => {
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
