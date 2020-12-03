import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Heading, Text } from '@pancakeswap-libs/uikit'

export interface PrizeGridProps {
  lotteryPrizeAmount?: number
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, auto);
`

const RightAlignedText = styled(Text)`
  text-align: right;
`

const RightAlignedHeading = styled(Heading)`
  text-align: right;
`

const GridItem = styled.div<{ marginBottom?: string }>`
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : '10px')};
`

const PrizeGrid: React.FC<PrizeGridProps> = ({ lotteryPrizeAmount = 0 }) => {
  const fourMatchesAmount = +((lotteryPrizeAmount / 100) * 60).toFixed(0)
  const threeMatchesAmount = +((lotteryPrizeAmount / 100) * 20).toFixed(0)
  const twoMatchesAmount = +((lotteryPrizeAmount / 100) * 10).toFixed(0)
  const burnAmount = +((lotteryPrizeAmount / 100) * 10).toFixed(0)
  const TranslateString = useI18n()

  return (
    <Grid>
      <GridItem>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(999, 'No. Matched')}
        </Text>
      </GridItem>
      <GridItem>
        <RightAlignedText fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Prize Pot')}
        </RightAlignedText>
      </GridItem>
      {/* 4 matches row */}
      <GridItem>
        <Heading size="md">4</Heading>
      </GridItem>
      <GridItem>
        <RightAlignedHeading size="md">{fourMatchesAmount.toLocaleString()}</RightAlignedHeading>
      </GridItem>
      {/* 3 matches row */}
      <GridItem>
        <Text bold>3</Text>
      </GridItem>
      <GridItem>
        <RightAlignedText>{threeMatchesAmount.toLocaleString()}</RightAlignedText>
      </GridItem>
      {/* 2 matches row */}
      <GridItem marginBottom="20px">
        <Text>2</Text>
      </GridItem>
      <GridItem marginBottom="20px">
        <RightAlignedText>{twoMatchesAmount.toLocaleString()}</RightAlignedText>
      </GridItem>
      {/* Burn row */}
      <GridItem marginBottom="0">
        <Text>{TranslateString(999, 'To burn:')}</Text>
      </GridItem>
      <GridItem marginBottom="0">
        <RightAlignedText>{burnAmount.toLocaleString()}</RightAlignedText>
      </GridItem>
    </Grid>
  )
}

export default PrizeGrid
