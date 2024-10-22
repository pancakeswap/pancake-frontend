import { AddIcon, Box, Flex, IconButton, Input, MinusIcon, Text } from '@pancakeswap/uikit'
import { Dispatch, useCallback, useMemo } from 'react'
import { Proposal, ProposalState } from 'state/types'
import { styled } from 'styled-components'
import { WeightedVoteState } from 'views/Voting/Proposal/VoteType/types'

const Choice = styled.label`
  max-width: 100%;
  overflow: hidden;
  display: flex;
  padding: 8px 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: center;
  }
`

const ChoiceText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: initial;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0 auto 0 0;
  }
`

const IconButtonStyle = styled(IconButton)`
  border-radius: 8px;
  width: 26px;
  min-width: 26px;
  height: 26px;
`

const ContainerStyled = styled(Flex)`
  padding: 8px;
  max-width: 140px;
  min-width: 140px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`

const InputStyled = styled(Input)`
  border: 0px;
  height: 24px;
  box-shadow: none;
  text-align: center;

  &:focus {
    box-shadow: none !important;
  }
`

const DisableText = styled(Box)`
  max-width: 140px;
  min-width: 140px;
  padding: 8px;
  border-radius: 16px;
  text-align: center;
  height: 42px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textDisabled};
  background: ${({ theme }) => theme.colors.disabled};
`

interface WeightedVoteProps {
  proposal: Proposal
  hasAccountVoted: boolean
  vote: WeightedVoteState
  notEnoughVeCake: boolean
  setVote: Dispatch<WeightedVoteState>
}

export const WeightedVote: React.FC<WeightedVoteProps> = ({
  proposal,
  hasAccountVoted,
  vote,
  notEnoughVeCake,
  setVote,
}) => {
  const totalVote = useMemo(() => Object.values(vote).reduce((acc, value) => acc + value, 0), [vote])

  const percentageDisplay = useMemo(() => {
    const percentage = {}
    Object.keys(vote).forEach((key) => {
      percentage[key] = totalVote === 0 ? '0.00%' : `${((vote[key] / totalVote) * 100).toFixed(2)}%`
    })
    return percentage
  }, [totalVote, vote])

  const handleButton = (index: number, value: number) => {
    const newVoteData = {
      ...vote,
      [index]: value <= 0 ? 0 : value,
    } as WeightedVoteState

    setVote(newVoteData)
  }

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (e.currentTarget.validity.valid) {
        const newVoteData = {
          ...vote,
          [index]: Number(e.target.value),
        } as WeightedVoteState

        setVote(newVoteData)
      }
    },
    [setVote, vote],
  )

  return (
    <>
      {proposal.choices.map((choice, index) => {
        const choiceIndex = index + 1
        const inputValue = vote[choiceIndex]

        return (
          <Choice key={choice}>
            <ChoiceText>{choice}</ChoiceText>
            <Flex alignItems="center" ml={['0', '0', '0', '16px']}>
              <Text mr={['auto', 'auto', 'auto', '16px']}>{percentageDisplay[choiceIndex]}</Text>
              {hasAccountVoted || proposal.state === ProposalState.CLOSED ? (
                <DisableText>{inputValue}</DisableText>
              ) : (
                <ContainerStyled>
                  <IconButtonStyle
                    scale="sm"
                    variant="subtle"
                    disabled={inputValue === 0}
                    onClick={() => handleButton(choiceIndex, inputValue - 1)}
                  >
                    <MinusIcon color="currentColor" width="14px" />
                  </IconButtonStyle>
                  <InputStyled
                    pattern="^[0-9]+$"
                    inputMode="numeric"
                    value={inputValue}
                    disabled={notEnoughVeCake}
                    onChange={(e) => handleInput(e, choiceIndex)}
                  />
                  <IconButtonStyle
                    variant="subtle"
                    scale="sm"
                    disabled={notEnoughVeCake}
                    onClick={() => handleButton(choiceIndex, inputValue + 1)}
                  >
                    <AddIcon color="currentColor" width="14px" />
                  </IconButtonStyle>
                </ContainerStyled>
              )}
            </Flex>
          </Choice>
        )
      })}
    </>
  )
}
