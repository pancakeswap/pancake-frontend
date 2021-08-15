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

const ButtonText = styled(Text)`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const StyledButton = styled(Button)`
  flex-grow: 1;
  margin-right: 15px;
`

const StyledLink = styled(UiKitLink)`
  width: 100%;
`
const FILTERS = ['All', 'Featured', 'Legendary', 'Rare', 'Uncommon', 'Common']

const GraveTabButtons = ({ setGraves, stakedOnly, setStakedOnly }) => {
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)
  const { isLg, isXl, isMd } = useMatchBreakpoints()
  const isDesktop = isLg || isXl || isMd

  const toggleButtonMenu = (i) => {
    switch(i) {
      case 0: // All
        setGraves(graves())
        break
      case 1: // Featured
        setGraves(graves().filter(g => g.isFeatured))
        break
      case 2: // Legendary
        setGraves(graves().filter(g => g.rarity === "Legendary"))
        break
      case 3: // Rare
        setGraves(graves().filter(g => g.rarity === "Rare"))
        break
      case 4: // Uncommon
        setGraves(graves().filter(g => g.rarity === "Uncommon"))
        break
      case 5: // Common
        setGraves(graves().filter(g => g.rarity === "Common"))
        break
      default:
        setGraves(graves())
        break
    }
    setIndex(i)
  }

  const nextFilter = () => {
    if(index === 5) {
      toggleButtonMenu(0)
    } else {
      toggleButtonMenu(index + 1)
    }
  }

  return (
    <Flex alignItems='center' justifyContent='center' mb='32px'>
      <Wrapper>
        {isDesktop ? <ButtonMenu onItemClick={toggleButtonMenu} activeIndex={index} scale='sm'>
          <ButtonMenuItem>
            <Text color="tertiary" bold>
            {t('All')}
            </Text>
          </ButtonMenuItem>
          <NotificationDot>
            <ButtonMenuItem>
              <Text color="tertiary" bold>
              {t('Featured')}
              </Text>
            </ButtonMenuItem>
          </NotificationDot>
          <NotificationDot>
            <ButtonMenuItem>
              <Text color="tertiary" bold>
              {t('Legendary')}
              </Text>
            </ButtonMenuItem>
          </NotificationDot>
          <NotificationDot>
            <ButtonMenuItem>
              <Text color="tertiary" bold>
              {t('Rare')}
              </Text>
            </ButtonMenuItem>
          </NotificationDot>
          <NotificationDot>
            <ButtonMenuItem>
              <Text color="tertiary" bold>
              {t('Uncommon')}
              </Text>
            </ButtonMenuItem>
          </NotificationDot>
          <NotificationDot>
            <ButtonMenuItem>
              <Text color="tertiary" bold>
              {t('Common')}
              </Text>
            </ButtonMenuItem>
          </NotificationDot>
        </ButtonMenu> :
          <StyledButton onClick={nextFilter} className="total-earned text-shadow">
            <Text color="tertiary">
              {t('Showing:')} {t(FILTERS[index])}
            </Text>
          </StyledButton>}
      </Wrapper>
         <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent='center' alignItems='center'>
          <Toggle scale='sm' checked={stakedOnly} onChange={(value) => {
            setStakedOnly(!stakedOnly)
          }} />
          <Text ml='8px'>{t('Staked only')}</Text>
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