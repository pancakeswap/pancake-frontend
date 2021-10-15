import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { NavLink } from 'react-router-dom'

/* eslint-disable */

import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import CatacombsBackgroundDesktopSVG from '../../../../images/CatacombsMain-1920x1080px.svg'
import CatacombsBackgroundMobileSVG from '../../../../images/CatacombsMain-414x720px.svg'
import Menu from '../../../../components/Catacombs/Menu'
import { useMatchBreakpoints } from '@rug-zombie-libs/uikit'

const StyledDiv = styled.div`
  text-align: center;
  position: relative;
  color: white;
  height: 100%;
  width: 100%;
`

const StyledButton = styled.button`
  title: 'BARRACKS';
  border: white;
  border: 10px solid white;
  height: 50%;
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
    width: 55%;
    height: 25%;
  }
`

const DataLabDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 15%;
  width: 100%;
  height: 24%;
  @media (max-width: 479px) {
    height: 40%;
    top: 10%;
  }
`

const RugRollDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 30%;
  width: 100%;
  height: 24%;
  @media (max-width: 479px) {
    top: 30%;
    height: 40%;
  }
`

const BarracksDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 45%;
  width: 100%;
  height: 24%;
  @media (max-width: 479px) {
    top: 50%;
    height: 40%;
  }
`

const BlackMarketDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 60%;
  width: 100%;
  height: 24%;
  @media (max-width: 479px) {
    top: 70%;
    height: 40%;
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl
  return (
    <Menu>
      <StyledDiv>
        {isDesktop ? <img src={CatacombsBackgroundDesktopSVG} alt='catacombs-rug-zombie' /> :
          <img src={CatacombsBackgroundMobileSVG} alt='catacombs-rug-zombie' />
        }
        <DataLabDiv>
          <NavLink exact activeClassName='active' to='/datalab' id='lottery-pot-banner'
                   style={{ paddingTop: '8px' }}>
            <StyledButton>{t('DATA LAB')}</StyledButton>
          </NavLink>
        </DataLabDiv>
        <BarracksDiv>
          <StyledButton>{t('BARRACKS')}</StyledButton>
        </BarracksDiv>
        <RugRollDiv>
          <StyledButton>{t('RUG ROLL')}</StyledButton>
        </RugRollDiv>
        <BlackMarketDiv>
          <StyledButton>{t('BLACK MARKET')}</StyledButton>
        </BlackMarketDiv>
      </StyledDiv>
    </Menu>
  )
}

export default Home