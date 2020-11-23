import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from '@pancakeswap-libs/uikit'

const Grid = styled.div`
  padding-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
`

const RightAlignedText = styled(Text)`
  text-align: right;
`

const RightAlignedHeading = styled(Heading)`
  text-align: right;
`

const GridItem = styled.div`
  margin-bottom: 10px;
`

const PrizeGrid = () => {
  return (
    <Grid>
      <GridItem>
        <Text fontSize="14px" color="textSubtle">
          No. Matched
        </Text>
      </GridItem>
      <GridItem>
        <RightAlignedText fontSize="14px" color="textSubtle">
          Win Chance
        </RightAlignedText>
      </GridItem>
      <GridItem>
        <RightAlignedText fontSize="14px" color="textSubtle">
          Prize Pot
        </RightAlignedText>
      </GridItem>
      <GridItem>
        <Heading size="md">4</Heading>
      </GridItem>
      <GridItem>
        <RightAlignedHeading size="md">0.001%</RightAlignedHeading>
      </GridItem>
      <GridItem>
        <RightAlignedHeading size="md">60,000</RightAlignedHeading>
      </GridItem>
      <GridItem>
        <Text bold>3</Text>
      </GridItem>
      <GridItem>
        <RightAlignedText fontSize="14px" color="textSubtle">
          0.36%
        </RightAlignedText>
      </GridItem>
      <GridItem>
        <RightAlignedText fontSize="14px" color="textSubtle">
          Prize Pot
        </RightAlignedText>
      </GridItem>
    </Grid>
  )
}

export default PrizeGrid
