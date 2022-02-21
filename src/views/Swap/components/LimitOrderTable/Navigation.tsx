import { useState } from 'react'
import { Text, ArrowBackIcon, ArrowForwardIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

// Copy from src/views/Nft/market/Collections
// Will refactor for reuse

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

export default function Navigation() {
  const maxPage = 10
  const [page, setPage] = useState(1)
  const { t } = useTranslation()

  return (
    <>
      <PageButtons>
        <Arrow
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>

        <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>

        <Arrow
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </>
  )
}
