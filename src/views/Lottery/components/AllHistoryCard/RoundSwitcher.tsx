import React from 'react'
import styled from 'styled-components'
import { IconButton, ArrowForwardIcon, ArrowBackIcon, ArrowLastIcon, Flex, Heading, Input } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)`
  width: 60px;
  height: 100%;
  padding: 4px 16px;
`

const StyledIconButton = styled(IconButton)`
  width: 32px;

  :disabled {
    background: none;

    svg {
      fill: ${({ theme }) => theme.colors.textDisabled};

      path {
        fill: ${({ theme }) => theme.colors.textDisabled};
      }
    }
  }
`

interface RoundSwitcherProps {
  isLoading: boolean
  selectedRoundId: string
  mostRecentRound: number
  handleInputChange: (event: any) => void
  handleArrowButtonPress: (targetRound: number) => void
}

const RoundSwitcher: React.FC<RoundSwitcherProps> = ({
  isLoading,
  selectedRoundId,
  mostRecentRound,
  handleInputChange,
  handleArrowButtonPress,
}) => {
  const { t } = useTranslation()
  const selectedRoundIdAsInt = parseInt(selectedRoundId, 10)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      handleInputChange(e)
    }
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <Heading mr="8px">{t('Round')}</Heading>
        <StyledInput
          pattern="^[0-9]+$"
          inputMode="numeric"
          disabled={isLoading}
          id="round-id"
          name="round-id"
          value={selectedRoundId}
          scale="lg"
          onChange={handleOnChange}
        />
      </Flex>
      <Flex alignItems="center">
        <StyledIconButton
          disabled={!selectedRoundIdAsInt || selectedRoundIdAsInt <= 1}
          onClick={() => handleArrowButtonPress(selectedRoundIdAsInt - 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowBackIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={selectedRoundIdAsInt >= mostRecentRound}
          onClick={() => handleArrowButtonPress(selectedRoundIdAsInt + 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowForwardIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={selectedRoundIdAsInt >= mostRecentRound}
          onClick={() => handleArrowButtonPress(mostRecentRound)}
          variant="text"
          scale="sm"
        >
          <ArrowLastIcon />
        </StyledIconButton>
      </Flex>
    </Flex>
  )
}

export default RoundSwitcher
