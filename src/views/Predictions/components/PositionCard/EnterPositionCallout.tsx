import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { ArrowDownIcon, ArrowUpIcon, Box, Button, CheckmarkCircleIcon, Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Balance from 'components/Balance'
import { PositionType } from './types'

interface EnterPositionCalloutProps {
  prizePool: number
  isLive: boolean
  positionEntered?: PositionType
  tokenSymbol?: string
}

interface StyledEnterPositionCalloutProps {
  isLive: EnterPositionCalloutProps['isLive']
  positionEntered: EnterPositionCalloutProps['positionEntered']
  theme: DefaultTheme
}

const getBorderColor = ({ theme, isLive, positionEntered }: StyledEnterPositionCalloutProps) => {
  if (!isLive) {
    return theme.colors[positionEntered === undefined ? 'tertiary' : 'secondary']
  }

  if (positionEntered === 'up') {
    return theme.colors.success
  }

  if (positionEntered === 'down') {
    return theme.colors.failure
  }

  return theme.colors.tertiary
}

const StyledEnterPositionCallout = styled(Box)<StyledEnterPositionCalloutProps>`
  border: 2px solid ${getBorderColor};
  border-radius: 8px;
  padding: 16px;
`

const PositionButton = styled(Button)`
  text-transform: uppercase;
`

const EnterPositionCallout: React.FC<EnterPositionCalloutProps> = ({
  prizePool,
  isLive,
  positionEntered,
  tokenSymbol = 'BNB',
}) => {
  const TranslateString = useI18n()
  const hasPosition = positionEntered !== undefined

  return (
    <StyledEnterPositionCallout isLive={isLive} positionEntered={positionEntered}>
      {hasPosition && (
        <Button disabled width="100%" mb="16px" startIcon={<CheckmarkCircleIcon color="textDisabled" />}>
          {TranslateString(999, 'Position Entered')}
        </Button>
      )}
      <Flex justifyContent="space-between" mb="8px">
        <Text bold fontSize="14px">
          {TranslateString(999, 'Prize pool')}:
        </Text>
        <Balance value={prizePool} decimals={2} fontSize="14px" unit={` ${tokenSymbol}`} />
      </Flex>
      {!hasPosition && (
        <Box>
          <PositionButton width="100%" startIcon={<ArrowUpIcon />} variant="success" mb="8px">
            {TranslateString(999, 'Up')}
          </PositionButton>
          <PositionButton width="100%" startIcon={<ArrowDownIcon />} variant="danger">
            {TranslateString(999, 'Down')}
          </PositionButton>
        </Box>
      )}
    </StyledEnterPositionCallout>
  )
}

export default EnterPositionCallout
