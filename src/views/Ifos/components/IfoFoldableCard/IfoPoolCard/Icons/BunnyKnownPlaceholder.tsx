import { Svg, SvgProps } from '@pancakeswap/uikit'
import { useTheme } from 'styled-components'

const BunnyKnownPlaceholder: React.FC<SvgProps> = (props) => {
  const theme = useTheme()
  const primaryColor = theme.isDark ? '#3C3742' : '#e9eaeb'
  const secondaryColor = theme.isDark ? '#666171' : '#bdc2c4'

  return (
   <Svg viewBox="0 0 198 199" {...props}>
      <image width="200" height="200" href="/images/metaegg-logo-200.png"/>
    </Svg>
  )
}

export default BunnyKnownPlaceholder
