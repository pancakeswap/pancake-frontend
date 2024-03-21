import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, ArrowLastIcon, Flex, Heading, IconButton, Input } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { styled } from 'styled-components'

const StyledInput = styled(Input)`
  width: 70px;
  height: 100%;
  padding: 4px 16px;
`

const StyledIconButton = styled(IconButton)`
  width: 32px;

  &:disabled {
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
  isLoading?: boolean
  selectedRoundId?: string
  mostRecentRound: number | null
  handleInputChange: (event: any) => void
  handleArrowButtonPress: (targetRound: number) => void
}

const RoundSwitcher: React.FC<React.PropsWithChildren<RoundSwitcherProps>> = ({
  isLoading,
  selectedRoundId,
  mostRecentRound,
  handleInputChange,
  handleArrowButtonPress,
}) => {
  const { t } = useTranslation()
  const selectedRoundIdAsInt = parseInt(selectedRoundId ?? '0', 10)

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        handleInputChange(e)
      }
    },
    [handleInputChange],
  )

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
          disabled={mostRecentRound !== null && selectedRoundIdAsInt >= mostRecentRound}
          onClick={() => handleArrowButtonPress(selectedRoundIdAsInt + 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowForwardIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={mostRecentRound !== null && selectedRoundIdAsInt >= mostRecentRound}
          onClick={() => mostRecentRound !== null && handleArrowButtonPress(mostRecentRound)}
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
