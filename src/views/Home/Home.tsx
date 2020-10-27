import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import Spacer from '../../components/Spacer'
import { TranslateString } from '../../utils/translateTextHelpers'
import Balances from './components/Balances'

const Home: React.FC = () => {
  return (
    <Page>
      <Image src="/images/BG1.png" />
      <Blank />
      <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />
      <div
        style={{
          margin: '0 auto',
        }}
      >
        <Button
          text={`👩‍🍳 ${TranslateString(306, 'See the Kitchen')}`}
          to="/farms"
          variant="secondary"
        />
      </div>
    </Page>
  )
}

const Image = styled.img`
  position: absolute;
  z-index: -3;
  top: 10%;
  @media (max-width: 500px) {
    width: 100vw;
  }
`

const Blank = styled.div`
  height: 200px;
  @media (max-width: 500px) {
    height: 60px;
  }
`

export default Home
