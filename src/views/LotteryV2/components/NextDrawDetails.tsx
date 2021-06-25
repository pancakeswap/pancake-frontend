import React from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const NextDrawDetails = () => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Text fontSize="14px" mb="24px">
        {t('Match the winning number in the same order to share prizes. Current prizes up for grabs:')}
      </Text>
    </Wrapper>
  )
}

export default NextDrawDetails
