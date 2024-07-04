import { ChainId } from '@pancakeswap/chains'
import { Box, BoxProps, MultiSelect } from '@pancakeswap/uikit'
import { SHORT_SYMBOL } from 'components/NetworkSwitcher'
import { ASSET_CDN } from 'config/constants/endpoints'
import { SUPPORTED_CHAIN } from 'config/supportedChain'
import { useTheme } from 'styled-components'

interface NetworkMultiSelectorProps extends BoxProps {
  setPickMultiSelect: (chains: Array<ChainId>) => void
}

export const options = SUPPORTED_CHAIN.map((chain) => ({
  label: SHORT_SYMBOL[chain],
  value: chain.toString(),
  icon: `${ASSET_CDN}/web/chains/${chain}.png`,
}))

export const NetworkMultiSelector: React.FC<NetworkMultiSelectorProps> = (props) => {
  const theme = useTheme()

  const onChange = (e) => {
    const chains = e.value.map((chain) => Number(chain) as ChainId)
    props.setPickMultiSelect(chains)
  }

  return (
    <Box {...props}>
      <MultiSelect
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: theme.colors.backgroundAlt,
        }}
        scrollHeight="400px"
        options={options}
        onChange={onChange}
        defaultValue={options.map((i) => i.value)}
      />
    </Box>
  )
}
