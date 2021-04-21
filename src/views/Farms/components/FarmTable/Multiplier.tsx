import React from 'react'
import styled from 'styled-components'
import { HelpIcon, Skeleton, useTooltip } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />
  const TranslateString = useI18n()
  const tooltipContent = (
    <div>
      {TranslateString(999, 'The multiplier represents the amount of CAKE rewards each farm gets.')}
      <br />
      <br />
      {TranslateString(
        999,
        'For example, if a 1x farm was getting 1 CAKE per block, a 40x farm would be getting 40 CAKE per block.',
      )}
    </div>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, 'top-end', 'hover', undefined, undefined, [
    20,
    10,
  ])

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Multiplier
