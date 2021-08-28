import React, { useState } from 'react'
import styled from 'styled-components'
import {
  ButtonMenu,
  ButtonMenuItem,
  Button,
  HelpIcon,
  Toggle,
  Text,
  Flex,
  NotificationDot,
  Link as UiKitLink, Dropdown, useMatchBreakpoints,
} from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { graves } from '../../../redux/get'

const GraveTabButtons = ({ setFilter }) => {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)

  const toggleButtonMenu = (i) => {
    setFilter(i)
    setIndex(i)
  }

  return (
    <Flex alignItems='center' justifyContent='center' mb='32px'>
      <Wrapper>
        <ButtonMenu onItemClick={toggleButtonMenu} activeIndex={index} scale='sm'>
          <ButtonMenuItem>
            <Text color='tertiary' bold>
              {t('All')}
            </Text>
          </ButtonMenuItem>
          <NotificationDot>
            <ButtonMenuItem>
              <Text color='tertiary' bold>
                {t('In Wallet')}
              </Text>
            </ButtonMenuItem>
          </NotificationDot>
          <NotificationDot>
            <ButtonMenuItem>
              <Text color='tertiary' bold>
                {t('Not Owned')}
              </Text>
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu>
      </Wrapper>
    </Flex>
  )
}

export default GraveTabButtons


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`