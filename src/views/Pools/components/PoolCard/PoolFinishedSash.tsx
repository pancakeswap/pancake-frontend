import React from 'react'
import { Text, Box } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import SashVector from '../../svgs/SashVector'

const StyledText = styled(Text)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: rotate(45deg) translate(-50%, -40%);
`

const PoolFinishedSash = () => {
  const TranslateString = useI18n()

  return (
    <Box position="relative">
      <StyledText color="backgroundAlt" fontSize="16px" bold>
        {TranslateString(388, 'Finished')}
      </StyledText>
      <SashVector height="112px" width="112px" />
    </Box>
  )
}

export default PoolFinishedSash
