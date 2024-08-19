import { LottieComponentProps } from 'lottie-react'
import dynamic from 'next/dynamic'
import AILogoJSON from '../../../../../../public/images/predictions/prediction.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export const AIPredictionsLogo = (props?: Omit<LottieComponentProps, 'animationData'>) => {
  return <Lottie animationData={AILogoJSON} {...props} />
}
