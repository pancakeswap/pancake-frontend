import { Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useContext } from 'react'

import Page from '../Page'
import { SmartSwapForm } from './SmartSwap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import { SwapFeaturesContext } from './SwapFeaturesContext'

export default function Swap() {
  const { isChartExpanded } =
    useContext(SwapFeaturesContext)

  return (
    <Page removePadding={isChartExpanded}>
      <Flex width={['328px', , '100%']} height="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <SmartSwapForm />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
