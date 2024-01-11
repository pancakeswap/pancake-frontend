import { useCallback, useRef } from 'react'
import { useIsomorphicEffect } from '@pancakeswap/uikit'

export const useDrawCanvas = (
  videoRef: React.MutableRefObject<HTMLVideoElement | undefined> | React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  intervalRef: React.MutableRefObject<number>,
  width: number,
  height: number,
  onVideoStartCallback?: () => void,
  onVideoVideoEnd?: () => void,
  additionalVideoRefs?: React.RefObject<HTMLVideoElement>[],
) => {
  const video = videoRef?.current
  const canvas = canvasRef?.current
  const isElementReady = video && canvas
  const isVideoPlaying = useRef(false)

  const drawImage = useCallback(() => {
    isVideoPlaying.current = false
    const context = canvas?.getContext('2d')
    if (!canvas || !video || !context) return
    context.clearRect(0, 0, width, height)
    context.drawImage(video, 0, 0, width, height)
    additionalVideoRefs?.forEach((ref) => {
      const additionalVideo = ref.current
      if (!additionalVideo) return
      context.drawImage(additionalVideo, 0, 0, width, height)
    })
    onVideoStartCallback?.()
  }, [canvas, video, height, width, additionalVideoRefs, onVideoStartCallback])

  useIsomorphicEffect(() => {
    if (isElementReady) {
      video.onpause = () => {
        cancelAnimationFrame(intervalRef.current)
        isVideoPlaying.current = false
      }
      video.onended = () => {
        cancelAnimationFrame(intervalRef.current)
        onVideoVideoEnd?.()
        isVideoPlaying.current = false
      }
      video.onplay = () => {
        onVideoStartCallback?.()
      }
    }
  }, [isElementReady, intervalRef, onVideoStartCallback, onVideoVideoEnd, video])

  return { drawImage: isElementReady ? drawImage : null, isVideoPlaying }
}
