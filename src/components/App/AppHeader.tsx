import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot, ChartIcon } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<Props> = ({
  title,
  subtitle,
  helper,
  backTo,
  noConfig = false,
  setIsChartDisplayed,
  isChartDisplayed,
}) => {
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }

  return (
    <AppHeaderContainer>
      <Flex alignItems="flex-start" justifyContent="space-around">
        {backTo && (
          <IconButton as={Link} to={backTo}>
            <ArrowBackIcon width="32px" />
          </IconButton>
        )}
        {setIsChartDisplayed && (
          <IconButton onClick={toggleChartDisplayed} variant="text" scale="sm" mr="8px">
            <ChartIcon width="24px" color={isChartDisplayed ? 'failure' : 'primary'} />
          </IconButton>
        )}
        <Flex flexDirection="column" alignItems="center">
          <Heading as="h2" mb="8px">
            {title}
          </Heading>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />}
            <Text color="textSubtle" fontSize="14px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
        {!noConfig && (
          <Flex>
            <NotificationDot show={expertMode}>
              <GlobalSettings />
            </NotificationDot>
            <Transactions />
          </Flex>
        )}
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
