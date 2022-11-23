import Script from 'next/script'
import styled, { useTheme } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { LAYER_ZERO_JS } from 'components/layerZero/config'
import { LayerZeroWidget } from 'components/layerZero/LayerZeroWidget'

const Page = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  min-height: calc(100% - 56px);
  align-items: center;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.gradientBubblegum};

  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    place-content: center;
  }
`

const AptosBridge = () => {
  const theme = useTheme()

  return (
    <Page>
      <Script crossOrigin="anonymous" src={LAYER_ZERO_JS.src} integrity={LAYER_ZERO_JS.integrity} />
      <Flex
        flexDirection="column"
        width={['100%', null, '420px']}
        bg="backgroundAlt"
        borderRadius={[0, null, 24]}
        alignItems="center"
        height="100%"
      >
        <LayerZeroWidget theme={theme} />
      </Flex>
    </Page>
  )
}

export default AptosBridge
