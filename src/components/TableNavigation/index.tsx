import { useState } from 'react'
import { Text, ArrowBackIcon, ArrowForwardIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

interface TableNavigationProps {
  currentPage: number
  maxPage: number
  onPagePrev: () => void
  onPageNext: () => void
}

const TableNavigation: React.FC<TableNavigationProps> = ({ currentPage = 1, maxPage = 1, onPagePrev, onPageNext }) => {
  const { t } = useTranslation()

  return (
    <>
      <PageButtons>
        <Arrow onClick={onPagePrev}>
          <ArrowBackIcon color={currentPage === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>

        <Text>{t('Page %page% of %maxPage%', { page: currentPage, maxPage })}</Text>

        <Arrow onClick={onPageNext}>
          <ArrowForwardIcon color={currentPage === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </>
  )
}

export default TableNavigation
