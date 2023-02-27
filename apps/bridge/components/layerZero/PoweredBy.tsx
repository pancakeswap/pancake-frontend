import { Flex, Text } from '@pancakeswap/uikit'
import { useTheme } from '@pancakeswap/hooks'
import Image from 'next/image'

const PoweredBy = () => {
  const { isDark } = useTheme()
  return (
    <Flex py="10px" alignItems="center" justifyContent="center">
      <Text small color="textSubtle" mr="8px">
        Powered By
      </Text>
      <a href="https://layerzero.network/" target="_blank" rel="noreferrer noopener">
        <Image
          width={75}
          height={15}
          src="/layerZero.svg"
          alt="Powered By LayerZero"
          unoptimized
          style={{
            filter: isDark ? 'unset' : 'invert(1)',
          }}
        />
      </a>
    </Flex>
  )
}

export default PoweredBy
