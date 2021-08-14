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
} from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'

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
  const { t } = useTranslation()

  return (
    <Flex alignItems='center' justifyContent='center' mb='32px'>
      <Flex alignItems='center' flexDirection={['column', null, 'row', null]}>
        <ButtonMenu activeIndex={isExact ? 0 : 1} scale='sm'>
          <ButtonMenuItem as={Link} to={`${url}`}>
            <ButtonText color='secondary' bold fontSize='16px'>
              {t('Live')}
            </ButtonText>
          </ButtonMenuItem>
          <NotificationDot show={hasStakeInFinishedPools}>
            <ButtonMenuItem as={Link} to={`${url}/history`}>
              <ButtonText color='secondary' bold fontSize='16px'>
                {t('Finished')}
              </ButtonText>
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
        <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent='center' alignItems='center'>
          <Toggle scale='sm' checked={stakedOnly} onChange={() => setStakedOnly((prev) => !prev)} />
          <Text ml='8px'>{t('Staked only')}</Text>
        </Flex>
      </Flex>
      <Flex ml='24px' alignItems='center' justifyContent='flex-end'>
        <StyledLink external href='https://docs.rugzombie.io/graves/grave'>
          <Button px={['14px', null, null, null, '20px']} >
            <ButtonText color='secondary' bold fontSize='16px'>
              {t('Learn More')}
            </ButtonText>
            <HelpIcon color='secondary' ml={[null, null, null, 0, '6px']} />
          </Button>
        </StyledLink>
      </Flex>
    </Flex>
  )
}

export default PoolTabButtons
