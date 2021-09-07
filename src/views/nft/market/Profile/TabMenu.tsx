import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

const Tab = styled.button`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  border-width: 1px 1px 0 1px;
  border-style: solid solid none solid;
  border-color: ${({ theme }) =>
    `${theme.colors.cardBorder} ${theme.colors.cardBorder} transparent ${theme.colors.cardBorder}`};
  outline: 0;
  padding: 8px 16px;
  border-radius: 16px 16px 0 0;
  font-size: 16px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.background};
`

const TabMenu = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Tab>NFTs</Tab>
      <Tab>{t('Achievements')}</Tab>
    </div>
  )
}

export default TabMenu
