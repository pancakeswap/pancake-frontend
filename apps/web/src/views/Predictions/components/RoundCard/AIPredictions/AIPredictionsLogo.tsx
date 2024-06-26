import Lottie, { LottieComponentProps } from 'lottie-react'
import AILogoJSON from '../../../../../../public/images/predictions/prediction.json'

export const AIPredictionsLogo = (props?: Omit<LottieComponentProps, 'animationData'>) => {
  return <Lottie animationData={AILogoJSON} {...props} />
}
