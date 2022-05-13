let swapSound: HTMLAudioElement

const swapSoundURL = 'https://pancake.mypinata.cloud/ipfs/Qmc5kLWfQpQHu96iwre9DWSjtedXqVUgmCvehdcVPWZtc7'

export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio(swapSoundURL)
  }
  return swapSound
}
