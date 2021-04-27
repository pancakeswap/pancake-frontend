import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import {
  ButtonMenu,
  ButtonMenuItem,
  Button,
  HelpIcon,
  Toggle,
  Text,
  Flex,
  NotificationDot,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <Flex alignItems="center" justifyContent="center" mb="32px">
      <Flex alignItems="center">
        <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
          <ButtonMenuItem as={Link} to={`${url}`}>
            {TranslateString(1198, 'Live')}
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedPools}>
            <ButtonMenuItem as={Link} to={`${url}/history`}>
              {TranslateString(388, 'Finished')}
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
        <Flex ml="24px" justifyContent="center" alignItems="center">
          <Toggle scale="sm" checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
          <Text ml="8px" color={`${stakedOnly ? 'body' : 'textDisabled'}`}>
            {TranslateString(999, 'Staked only')}
          </Text>
        </Flex>
      </Flex>
      <Flex ml="24px" alignItems="center" justifyContent="flex-end">
        <Button
          px={['14px', null, null, null, '20px']}
          variant="subtle"
          as="a"
          href="https://docs.pancakeswap.finance/syrup-pools/syrup-pool"
        >
          <ButtonText color="backgroundAlt" bold fontSize="16px">
            {TranslateString(999, 'Help')}
          </ButtonText>
          <HelpIcon color="backgroundAlt" ml={[null, null, null, 0, '6px']} />
        </Button>
      </Flex>
    </Flex>
  )
}

export default PoolTabButtons
