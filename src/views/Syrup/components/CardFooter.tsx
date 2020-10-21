import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from '../../../utils/formatBalance'
import SmallValue from './Value'
import CoreTag from './CoreTag'
import { ChevronDown, ChevronUp } from 'react-feather'

interface Props {
  projectLink: string
  totalStaked: BigNumber
  blocksRemaining: number
  isFinished: boolean
}

const StyledFooter = styled.div<{ isFinished: boolean }>`
  border-top: 1px solid #e9eaeb;
  color: ${({ isFinished, theme }) =>
    theme.colors[isFinished ? 'textDisabled2' : 'primary2']};
  padding: 24px;
`

const StyledDetailsButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.colors.primaryv2};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  outline: 0;
  padding: 0;
  &:hover {
    opacity: 0.9;
  }

  & > svg {
    margin-left: 4px;
  }
`

const Details = styled.div`
  margin-top: 24px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
`

const FlexFull = styled.div`
  flex: 1;
`
const Label = styled.div`
  font-size: 14px;
`
const TokenLink = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: #12aab5;
`

// TODO: Fix "TranslateString" throwing error "React has detected a change in the order of Hooks"

const CardFooter: React.FC<Props> = ({
  projectLink,
  totalStaked,
  blocksRemaining,
  isFinished,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = isOpen ? ChevronUp : ChevronDown

  const handleClick = () => setIsOpen(!isOpen)

  return (
    <StyledFooter isFinished={isFinished}>
      <Row>
        <FlexFull>
          <CoreTag />
        </FlexFull>
        <StyledDetailsButton onClick={handleClick}>
          {isOpen ? 'Hide' : 'Details'} <Icon />
        </StyledDetailsButton>
      </Row>
      {isOpen && (
        <Details>
          <Row style={{ marginBottom: '4px' }}>
            <FlexFull>
              <Label>
                <span role="img" aria-label="syrup">
                  🍯{' '}
                </span>
                Total
              </Label>
            </FlexFull>
            <SmallValue
              isFinished={isFinished}
              value={getBalanceNumber(totalStaked)}
            />
          </Row>
          {blocksRemaining > 0 && (
            <Row>
              <FlexFull>
                <Label>End:</Label>
              </FlexFull>
              <SmallValue isFinished={isFinished} value={blocksRemaining} />
            </Row>
          )}
          <TokenLink href={projectLink} target="_blank">
            View project site
          </TokenLink>
        </Details>
      )}
    </StyledFooter>
  )
}

export default React.memo(CardFooter)
