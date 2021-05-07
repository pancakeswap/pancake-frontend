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
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const StyledLink = styled(UiKitLink)`
  width: 100%;

  &:hover {
    text-decoration: none;
  }
`

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools }) => {
  const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()

  return (
    <Flex alignItems="center" justifyContent="center" mb="32px">
      <Flex alignItems="center" flexDirection={['column', null, 'row', null]}>
        <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
          <ButtonMenuItem as={Link} to={`${url}`}>
            {t('Live')}
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedPools}>
            <ButtonMenuItem as={Link} to={`${url}/history`}>
              {t('Finished')}
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
        <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent="center" alignItems="center">
          <Toggle scale="sm" checked={stakedOnly} onChange={() => setStakedOnly((prev) => !prev)} />
          <Text ml="8px">{t('Staked only')}</Text>
        </Flex>
      </Flex>
      <Flex ml="24px" alignItems="center" justifyContent="flex-end">
        <StyledLink external href="https://docs.pancakeswap.finance/syrup-pools/syrup-pool">
          <Button px={['14px', null, null, null, '20px']} variant="subtle">
            <ButtonText color="backgroundAlt" bold fontSize="16px">
              {t('Help')}
            </ButtonText>
            <HelpIcon color="backgroundAlt" ml={[null, null, null, 0, '6px']} />
          </Button>
        </StyledLink>
      </Flex>
    </Flex>
  )
}

export default PoolTabButtons
