import { BackgroundImage, BoxProps } from '@pancakeswap/uikit'
import PlaceholderImage from './PlaceholderImage'

interface PreviewImageProps extends BoxProps {
  src: string
  height?: number
  width?: number
}

const PreviewImage: React.FC<React.PropsWithChildren<PreviewImageProps>> = ({ height = 64, width = 64, ...props }) => {
  return (
    <BackgroundImage
      loadingPlaceholder={<PlaceholderImage />}
      height={height}
      width={width}
      style={{ borderRadius: '8px' }}
      {...props}
    />
  )
}

export default PreviewImage
