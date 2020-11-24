// @ts-nocheck
import React from 'react'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'

const Nft = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Container>
        <Hero />
      </Container>
    </Page>
  )
}

export default Nft
