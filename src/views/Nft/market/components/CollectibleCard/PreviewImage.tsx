import { BackgroundImage, ImageProps } from '@pancakeswap/uikit'
import PlaceholderImage from './PlaceholderImage'

interface PreviewImageProps extends Omit<ImageProps, 'width' | 'height'> {
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
