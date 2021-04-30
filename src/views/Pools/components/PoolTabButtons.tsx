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
  Link as UiKitLink,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const StyledLink = styled(UiKitLink)`
  width: 100%;
`

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <Flex alignItems="center" justifyContent="center" mb="32px">
      <Flex alignItems="center" flexDirection={['column', null, 'row', null]}>
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
        <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent="center" alignItems="center">
          <Toggle scale="sm" checked={stakedOnly} onChange={() => setStakedOnly((prev) => !prev)} />
          <Text ml="8px">{TranslateString(999, 'Staked only')}</Text>
        </Flex>
      </Flex>
      <Flex ml="24px" alignItems="center" justifyContent="flex-end">
        <StyledLink external href="https://docs.pancakeswap.finance/syrup-pools/syrup-pool">
          <Button px={['14px', null, null, null, '20px']} variant="subtle">
            <ButtonText color="backgroundAlt" bold fontSize="16px">
              {TranslateString(999, 'Help')}
            </ButtonText>
            <HelpIcon color="backgroundAlt" ml={[null, null, null, 0, '6px']} />
          </Button>
        </StyledLink>
      </Flex>
    </Flex>
  )
}

export default PoolTabButtons
