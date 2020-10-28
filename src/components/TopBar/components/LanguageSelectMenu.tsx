import React, { useRef, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useOnClickOutside } from '../../../hooks/useOnClickOutside'
import useToggle from '../../../hooks/useToggle'
import {
  LanguageContext,
  LanguageObject,
} from '../../../contexts/Localisation/languageContext'
import { allLanguages } from '../../../constants/localisation/languageCodes'
import LanguageSelectButton from './LanguageSelectButton'
import { Globe } from 'react-feather'

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;

  svg {
    height: 19px;
    width: 19px;
    margin-right: 0.2rem;
  }

  @media (max-width: 850px) {
    margin-left: 0.2rem;
  }
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background: ${(props) => props.theme.card.background};
  color: #32cad7;
  border: 2px solid ${(props) => props.color};
  border-radius: 12px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled.div`
  flex: 1;
  padding: 0.25rem 0.5rem;
  color: ${(props) => props.color};
  :hover {
    color: #452a7a;
    cursor: pointer;
    text-decoration: none;
  }
`

const StyledText = styled.span`
  padding: 0 0.5rem 0.25rem;
  color: ${(props) => props.color};
  font-weight: 700;
  font-size: 14px;
`

const MenuItemsWrapper = styled.div`
  max-height: 50vh;
  overflow-y: scroll;
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)

  useOnClickOutside(node, open ? toggle : undefined)

  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)

  const { colors } = useContext(ThemeContext)
  const textColor = colors.primaryBright

  const parseLanguageTextRendering = (languageCode: string) => {
    switch (languageCode) {
      case 'pt-BR':
        return 'PT'
      case 'es-ES':
        return 'ES'
      case 'sv-SE':
        return 'SE'
      case 'zh-CN':
        return 'CN'
      case 'zh-TW':
        return 'TW'
      default:
        return languageCode.toUpperCase()
    }
  }

  const handleLanguageSelect = (langObject: LanguageObject) => {
    setSelectedLanguage(langObject)
    toggle()
    localStorage.setItem('pancakeSwapLanguage', langObject.code)
  }

  return (
    <StyledMenu ref={node as any}>
      <LanguageSelectButton onClick={toggle} size={'sm'}>
        <Globe />
        {(selectedLanguage &&
          parseLanguageTextRendering(selectedLanguage.code)) ||
          'EN'}
      </LanguageSelectButton>
      {open && (
        <MenuFlyout>
          <StyledText color={textColor}>Language</StyledText>
          <MenuItemsWrapper>
            {allLanguages.map((langObject) => {
              return (
                <MenuItem
                  key={langObject.code}
                  onClick={() => handleLanguageSelect(langObject)}
                  color={textColor}
                >
                  {langObject.language}
                </MenuItem>
              )
            })}
          </MenuItemsWrapper>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
