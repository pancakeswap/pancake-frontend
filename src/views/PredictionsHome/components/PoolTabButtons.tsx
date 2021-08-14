import React, { useState } from 'react'
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
import { auctions } from '../../../redux/get'

const ButtonText = styled(Text)`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const StyledLink = styled(UiKitLink)`
  width: 100%;
`

const PoolTabButtons = ({ setAuctions }) => {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const liveAuctions = auctions().filter(a => !a.isFinished)

  const toggleButtonMenu = () => {
    if(index === 0) {
      setIndex(1)
      setAuctions(liveAuctions)
    } else {
      setIndex(0)
      setAuctions(auctions())
    }
  }


  return (
    <Flex alignItems='center' justifyContent='center' mb='32px'>
      <Flex alignItems='center' flexDirection={['column', null, 'row', null]}>
        <ButtonMenu onItemClick={toggleButtonMenu} activeIndex={index} scale='sm'>
          <ButtonMenuItem >
            <ButtonText color='secondary' bold fontSize='16px'>
              {t('All')}
            </ButtonText>
          </ButtonMenuItem>
          <NotificationDot >
            <ButtonMenuItem>
              <ButtonText color='secondary' bold fontSize='16px'>
                {t('Live')}
              </ButtonText>
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
        {/* <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent='center' alignItems='center'> */}
        {/*  <Toggle scale='sm'  /> */}
        {/*  <Text ml='8px'>{t('Staked only')}</Text> */}
        {/* </Flex> */}
      </Flex>
      <Flex ml='24px' alignItems='center' justifyContent='flex-end'>
        <StyledLink external href='https://rugzombie.medium.com/new-feature-alert-introducing-the-mausoleum-4867bb4bdcbb'>
          <Button px={['14px', null, null, null, '20px']}  >
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
