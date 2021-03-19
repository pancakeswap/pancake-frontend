import React from 'react'
import { useDispatch } from 'react-redux'
import { ArrowForwardIcon, Box, Button, Checkbox, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import { setHistoryPaneState } from 'state/predictions'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { getBubbleGumBackground } from '../../helpers'

const StyledHeader = styled(Box)`
  background: ${({ theme }) => getBubbleGumBackground(theme)};

  padding: 16px;
`

const Label = styled.label`
  align-items: center;
  cursor: pointer;
  display: flex;
  margin-right: 8px;
`

const Header = () => {
  const TranslateString = useI18n()
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setHistoryPaneState(false))
  }

  return (
    <StyledHeader>
      <Flex alignItems="center" justifyContent="space-between" mb="16px">
        <Heading as="h3" size="md">
          {TranslateString(999, 'Your History')}
        </Heading>
        <Button onClick={handleClick} variant="text" endIcon={<ArrowForwardIcon color="primary" />} px="0">
          {TranslateString(999, 'Close Pane')}
        </Button>
      </Flex>
      <Text color="textSubtle" fontSize="12px" mb="8px">
        {TranslateString(999, 'Filter')}
      </Text>
      <Flex alignItems="center">
        <Label htmlFor="collected">
          <Checkbox scale="sm" checked />
          <Text ml="8px">{TranslateString(999, 'Collected')}</Text>
        </Label>
        <Label htmlFor="won">
          <Checkbox scale="sm" />
          <Text ml="8px">{TranslateString(999, 'Won')}</Text>
        </Label>
        <Label htmlFor="lost">
          <Checkbox scale="sm" />
          <Text ml="8px">{TranslateString(999, 'Lost')}</Text>
        </Label>
      </Flex>
    </StyledHeader>
  )
}

export default Header
