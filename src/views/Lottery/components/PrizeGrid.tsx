import React from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import { BigNumber } from 'bignumber.js'
import { usePriceCakeBusd } from 'state/hooks'
import CardBusdValue from '../../Home/components/CardBusdValue'

export interface PrizeGridProps {
  lotteryPrizeAmount?: number
  pastDraw?: boolean
  jackpotMatches?: number
  oneTicketMatches?: number
  twoTicketMatches?: number
  threeTicketMatches?: number
}

const Grid = styled.div<{ pastDraw?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${(props) => (props.pastDraw ? 3 : 2)}, 1fr);
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

const PastDrawGridItem = styled(GridItem)`
  transform: translate(-40%, 0%);
`

const PrizeGrid: React.FC<PrizeGridProps> = ({
  lotteryPrizeAmount = 0,
  pastDraw = false,
  jackpotMatches,
  twoTicketMatches,
  threeTicketMatches,
}) => {
  const fourMatchesAmount = +((lotteryPrizeAmount / 100) * 50).toFixed(0)
  const threeMatchesAmount = +((lotteryPrizeAmount / 100) * 20).toFixed(0)
  const twoMatchesAmount = +((lotteryPrizeAmount / 100) * 10).toFixed(0)
  const burnAmount = +((lotteryPrizeAmount / 100) * 20).toFixed(0)
  const TranslateString = useI18n()
  const cakeBusdPrice = usePriceCakeBusd()

  const getCakeBusdValue = (amount: number) => {
    return new BigNumber(amount).multipliedBy(cakeBusdPrice).toNumber()
  }

  return (
    <Grid pastDraw={pastDraw}>
      <GridItem>
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(756, 'No. Matched')}
        </Text>
      </GridItem>
      {pastDraw && (
        <PastDrawGridItem>
          <RightAlignedText fontSize="14px" color="textSubtle">
            {TranslateString(754, 'Winners')}
          </RightAlignedText>
        </PastDrawGridItem>
      )}
      <GridItem>
        <RightAlignedText fontSize="14px" color="textSubtle">
          {TranslateString(752, 'Prize Pot')}
        </RightAlignedText>
      </GridItem>
      {/* 4 matches row */}
      <GridItem>
        <Heading size="md">4</Heading>
      </GridItem>
      {pastDraw && (
        <PastDrawGridItem>
          <RightAlignedHeading size="md">{jackpotMatches}</RightAlignedHeading>
        </PastDrawGridItem>
      )}
      <GridItem>
        <RightAlignedHeading size="md">
          {fourMatchesAmount.toLocaleString()}
          {!pastDraw && !cakeBusdPrice.eq(0) && <CardBusdValue value={getCakeBusdValue(fourMatchesAmount)} />}
        </RightAlignedHeading>
      </GridItem>
      {/* 3 matches row */}
      <GridItem>
        <Text bold>3</Text>
      </GridItem>
      {pastDraw && (
        <PastDrawGridItem>
          <RightAlignedText bold>{threeTicketMatches}</RightAlignedText>
        </PastDrawGridItem>
      )}
      <GridItem>
        <RightAlignedText>
          {threeMatchesAmount.toLocaleString()}
          {!pastDraw && !cakeBusdPrice.eq(0) && <CardBusdValue value={getCakeBusdValue(threeMatchesAmount)} />}
        </RightAlignedText>
      </GridItem>
      {/* 2 matches row */}
      <GridItem>
        <Text>2</Text>
      </GridItem>
      {pastDraw && (
        <PastDrawGridItem>
          <RightAlignedText>{twoTicketMatches}</RightAlignedText>
        </PastDrawGridItem>
      )}
      <GridItem>
        <RightAlignedText>
          {twoMatchesAmount.toLocaleString()}
          {!pastDraw && !cakeBusdPrice.eq(0) && <CardBusdValue value={getCakeBusdValue(twoMatchesAmount)} />}
        </RightAlignedText>
      </GridItem>
      {/* Burn row */}
      <GridItem marginBottom="0">
        <Text>{TranslateString(999, `${pastDraw ? 'Burned' : 'To burn'}`)}:</Text>
      </GridItem>
      {pastDraw ? (
        <>
          <GridItem marginBottom="0" />
          <GridItem marginBottom="0">
            <RightAlignedText>{burnAmount.toLocaleString()}</RightAlignedText>
          </GridItem>
        </>
      ) : (
        <GridItem marginBottom="0">
          <RightAlignedText>{burnAmount.toLocaleString()}</RightAlignedText>
        </GridItem>
      )}
    </Grid>
  )
}

export default PrizeGrid
