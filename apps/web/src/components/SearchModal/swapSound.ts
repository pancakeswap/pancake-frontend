let swapSound: HTMLAudioElement
export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio('swap.mp3')
  }
  return swapSound
}
