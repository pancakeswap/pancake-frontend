import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, CardFooter, ChevronUpIcon, ChevronDownIcon, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getPancakeRabbitContract } from '../../utils/contracts'
import InfoRow from '../InfoRow'

interface FooterProps {
  bunnyId: number
}

const DetailsButton = styled(Button).attrs({ variant: 'text', fullWidth: true })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const InfoBlock = styled.div`
  padding: 0 24px 24px;
`

const Value = styled(Text)`
  font-weight: 600;
`

const Footer: React.FC<FooterProps> = ({ bunnyId }) => {
  const [state, setState] = useState({
    isLoading: false,
    isDataFetched: false,
    isOpen: false,
    bunnyCount: 0,
    bunnyBurnCount: 0,
  })
  const TranslateString = useI18n()
  const Icon = state.isOpen ? ChevronUpIcon : ChevronDownIcon

  const handleClick = async () => {
    if (state.isDataFetched) {
      setState((prevState) => ({ ...prevState, isOpen: !prevState.isOpen }))
    } else {
      setState((prevState) => ({ ...prevState, isLoading: true }))
      try {
        const { methods } = getPancakeRabbitContract()
        const bunnyCount = await methods.bunnyCount(bunnyId).call()
        const bunnyBurnCount = await methods.bunnyBurnCount(bunnyId).call()

        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          isDataFetched: true,
          isOpen: !prevState.isOpen,
          bunnyCount,
          bunnyBurnCount,
        }))
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <CardFooter p="0">
      <DetailsButton endIcon={<Icon width="24px" color="primary" />} onClick={handleClick}>
        {state.isLoading ? TranslateString(999, 'Loading...') : TranslateString(999, 'Details')}
      </DetailsButton>
      {state.isOpen && (
        <InfoBlock>
          <InfoRow>
            <Text>{TranslateString(999, 'Value if traded in')}:</Text>
            <Value>10 CAKE</Value>
          </InfoRow>
          <InfoRow>
            <Text>{TranslateString(999, 'Number minted')}:</Text>
            <Value>{state.bunnyCount}</Value>
          </InfoRow>
          <InfoRow>
            <Text>{TranslateString(999, 'Number burned')}:</Text>
            <Value>{state.bunnyBurnCount}</Value>
          </InfoRow>
        </InfoBlock>
      )}
    </CardFooter>
  )
}

export default Footer
