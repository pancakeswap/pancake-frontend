import Lottie, { LottieComponentProps } from 'lottie-react'
import AILogoJSON from '../../../../../../public/images/predictions-temp/prediction.json'

// TODO: Move AI predictions images to assets CDN later
export const AIPredictionsLogo = (props?: Omit<LottieComponentProps, 'animationData'>) => {
  // return <img src="/images/predictions-temp/ai-logo.svg" alt="AI Predictions Logo" width="10" height="10" {...props} />
  return <Lottie animationData={AILogoJSON} {...props} />
}
