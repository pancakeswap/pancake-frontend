import { Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import React from 'react'
import { V3SwapForm } from './view/V3Swap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './view/styles'
import { useDefaultsFromURLSearch } from './state/hooks'

export default function Swap() {
  useDefaultsFromURLSearch()

  return (
    <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
      <Flex flexDirection="column">
        <StyledSwapContainer>
          <StyledInputCurrencyWrapper mt={'0'}>
            <AppBody>
              <V3SwapForm />
            </AppBody>
          </StyledInputCurrencyWrapper>
        </StyledSwapContainer>
      </Flex>
    </Flex>
  )
}
