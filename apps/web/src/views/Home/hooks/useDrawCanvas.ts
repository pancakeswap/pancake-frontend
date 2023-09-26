import { useCallback, useLayoutEffect, useRef } from 'react'

export const useDrawCanvas = (
  videoRef: React.MutableRefObject<HTMLVideoElement>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,

  width: number,
  height: number,
  fps: number,
  canvasInterval: number,
  onVideoStartCallback?: () => void,
  onVideoVideoEnd?: () => void,
  additionalVideoRefs?: React.MutableRefObject<HTMLVideoElement>[],
) => {
  const video = videoRef?.current
  const canvas = canvasRef?.current
  const isElementReady = video && canvas
  const isVideoPlaying = useRef(false)

  const drawImage = useCallback(() => {
    const context = canvas?.getContext('2d')
    if (!canvas || !video || !context) return
    context.clearRect(0, 0, width, height)
    context.drawImage(video, 0, 0, width, height)
    additionalVideoRefs?.forEach((ref) => {
      const additionalVideo = ref.current
      if (!additionalVideo) return
      context.drawImage(additionalVideo, 0, 0, width, height)
    })
  }, [canvas, video, height, width, additionalVideoRefs])

  useLayoutEffect(() => {
    if (isElementReady) {
      video.onpause = () => {
        clearInterval(canvasInterval)
        isVideoPlaying.current = false
      }
      video.onended = () => {
        clearInterval(canvasInterval)
        onVideoVideoEnd?.()
        isVideoPlaying.current = false
      }
      video.onplay = () => {
        onVideoStartCallback?.()
      }
    }
  }, [isElementReady, canvasInterval, onVideoStartCallback, onVideoVideoEnd, video])

  return { drawImage: isElementReady ? drawImage : null, isVideoPlaying }
}
