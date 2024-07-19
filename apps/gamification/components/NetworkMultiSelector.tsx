import { ChainId } from '@pancakeswap/chains'
import { Box, BoxProps, MultiSelect } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { targetChains } from 'config/supportedChain'
import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { chainNameConverter } from 'utils/chainNameConverter'

interface NetworkMultiSelectorProps extends BoxProps {
  pickMultiSelect: Array<ChainId>
  setPickMultiSelect: (chains: Array<ChainId>) => void
}

const options = targetChains.map((chain) => ({
  label: chainNameConverter(chain.name),
  value: chain.id.toString(),
  icon: `${ASSET_CDN}/web/chains/${chain.id}.png`,
}))

export const defaultValueChains = options.map((i) => Number(i.value) as ChainId)

export const NetworkMultiSelector: React.FC<NetworkMultiSelectorProps> = (props) => {
  const theme = useTheme()

  const convertValueToString = useMemo(() => props.pickMultiSelect.map((i) => i.toString()), [props])

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
        scrollHeight="330px"
        isShowSelectAll
        options={options}
        value={convertValueToString}
        onChange={onChange}
      />
    </Box>
  )
}
