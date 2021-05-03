import React from 'react'
import styled from 'styled-components'
import { Heading } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import NftList from './components/NftList'

const StyledHero = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 32px;
`

const Collectibles = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledHero>
        <Heading as="h1" size="xxl" color="secondary">
          {t('Pancake Collectibles')}
        </Heading>
      </StyledHero>
      <NftList />
    </Page>
  )
}

export default Collectibles
