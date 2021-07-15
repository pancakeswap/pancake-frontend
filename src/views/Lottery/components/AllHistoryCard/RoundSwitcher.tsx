import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, IconButton, ArrowForwardIcon, ArrowBackIcon, Flex, Heading, Input } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useLottery } from 'state/hooks'

const StyledInput = styled(Input)`
  width: 60px;
`

const StyledIconButton = styled(IconButton)`
  width: 24px;

  :disabled {
    background: none;

    svg {
      fill: ${({ theme }) => theme.colors.textDisabled};
    }
  }
`

interface RoundSwitcherProps {
  isLoading: boolean
  selectedRound: string
  mostRecentRound: number
  handleInputChange: (event: any) => void
  handleArrowButonPress: (targetRound: number) => void
}

const RoundSwitcher: React.FC<RoundSwitcherProps> = ({
  isLoading,
  selectedRound,
  mostRecentRound,
  handleInputChange,
  handleArrowButonPress,
}) => {
  const { t } = useTranslation()
  const selectedRoundAsInt = parseInt(selectedRound, 10)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <Heading mr="8px">{t('Round')}</Heading>
        <StyledInput
          disabled={isLoading}
          id="round-id"
          name="round-id"
          type="number"
          value={selectedRound}
          scale="lg"
          onChange={handleInputChange}
        />
      </Flex>
      <Flex alignItems="center">
        <StyledIconButton
          disabled={selectedRoundAsInt <= 1}
          onClick={() => handleArrowButonPress(selectedRoundAsInt - 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowBackIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={selectedRoundAsInt >= mostRecentRound}
          onClick={() => handleArrowButonPress(selectedRoundAsInt + 1)}
          variant="text"
          scale="sm"
        >
          <ArrowForwardIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={selectedRoundAsInt === mostRecentRound}
          onClick={() => handleArrowButonPress(mostRecentRound)}
          variant="text"
          scale="sm"
        >
          <ArrowForwardIcon />
        </StyledIconButton>
      </Flex>
    </Flex>
  )
}

export default RoundSwitcher
