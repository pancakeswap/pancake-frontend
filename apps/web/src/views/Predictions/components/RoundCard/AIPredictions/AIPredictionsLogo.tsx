import Lottie, { LottieComponentProps } from 'lottie-react'
import AILogoJSON from '../../../../../../public/images/predictions-temp/prediction.json'

// TODO: Move AI predictions images to assets CDN later
export const AIPredictionsLogo = (props?: Omit<LottieComponentProps, 'animationData'>) => {
  return <Lottie animationData={AILogoJSON} {...props} />
}
