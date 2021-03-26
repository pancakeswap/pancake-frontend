import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const StyledText = styled(Text)<{ column?: string }>`
  font-size: 12px;
  font-weight: 600;
  grid-row: 1;
  grid-column: ${({ column }) => column};
`

const HeadingRow = () => {
  const TranslateString = useI18n()

  return (
    <>
      <StyledText column="1">{TranslateString(999, 'Rank in team').toUpperCase()}</StyledText>
      <StyledText column="2">{TranslateString(999, 'Tier').toUpperCase()}</StyledText>
      <StyledText column="3">{TranslateString(999, 'CAKE Prizes (Split)').toUpperCase()}</StyledText>
      <StyledText column="4">{TranslateString(1092, 'Achievements').toUpperCase()}</StyledText>
      <StyledText column="5">NFT</StyledText>
    </>
  )
}

export default HeadingRow
