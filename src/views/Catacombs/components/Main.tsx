import { useTranslation } from 'contexts/Localization'
import React from 'react'
import Typewriter from 'typewriter-effect'
import { Heading, Text, Button } from '@catacombs-libs/uikit'
import styled from 'styled-components'
import Menu from '../../../components/Catacombs/Menu'
import Page from '../../../components/layout/Page'
import CatacombsBackground from '../../../images/Catacombs_650_x_650_px.svg'


const StyledButton = styled.button`
  title: 'BARRACKS';
  border: white;
  border: 10px solid white;
  height: 40%;
  width: 38%;
  background-color: transparent;
  color: white;
  font-size: 25px;
  box-shadow: inset 0 0 25px, 0 0 25px;
  border-radius: 5px;
  letter-spacing: 0.2em;

  :hover {
    box-shadow: inset 0 0 30px, 0 0 30px;
  }

  @media (max-width: 479px) {
    font-size: 15px;
    width: 50%;
  }
`

const BarracksDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 10%;
  width: 100%;
  height: 22%;
  @media (max-width: 479px) {
    height: 40%;;
  }
`

const RugRollDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 25%;
  width: 100%;
  height: 22%;
  @media (max-width: 479px) {
    top: 33%;
    height: 40%;
  }
`


const Main = () => {
  const { t } = useTranslation()
  return (
    <Menu>
      <>
        <Page>
          <div className='parent-div'>
            <img src={CatacombsBackground} alt='catacombs-rug-zombie' className='backgroundImageStyle' />
            <BarracksDiv>
              <StyledButton>BARRACKS</StyledButton>
            </BarracksDiv>
            <RugRollDiv>
              <StyledButton>RUG ROLL</StyledButton>
            </RugRollDiv>
          </div>
        </Page>
      </>
    </Menu>
  )
}

export default Main
