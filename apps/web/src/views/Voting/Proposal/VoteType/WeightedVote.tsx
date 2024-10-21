import { AddIcon, Box, Flex, IconButton, Input, MinusIcon, Text } from '@pancakeswap/uikit'
import { Proposal } from 'state/types'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'

const Choice = styled.label`
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
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
}

export const WeightedVote: React.FC<WeightedVoteProps> = ({ proposal }) => {
  const { address: account } = useAccount()

  return (
    <>
      {proposal.choices.map((choice) => {
        return (
          <Choice key={choice}>
            <ChoiceText>
              <Text as="span" title={choice}>
                {choice}
              </Text>
            </ChoiceText>
            <Flex alignItems="center">
              <Text mr={['auto', 'auto', 'auto', '16px']}>0.00%</Text>
              <DisableText>1230</DisableText>
              <ContainerStyled>
                <IconButtonStyle variant="subtle" scale="sm">
                  <MinusIcon color="currentColor" width="14px" />
                </IconButtonStyle>
                <InputStyled />
                <IconButtonStyle variant="subtle" scale="sm">
                  <AddIcon color="currentColor" width="14px" />
                </IconButtonStyle>
              </ContainerStyled>
            </Flex>
          </Choice>
        )
      })}
    </>
  )
}
