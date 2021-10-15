import { useTranslation } from 'contexts/Localization'
import React, { useState } from 'react'
import {
  Card,
  Button, Flex,
} from '@catacombs-libs/uikit'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@rug-zombie-libs/uikit' // requires a loader
import Menu from '../../../../components/Catacombs/Menu'
import CatacombsBackgroundDesktopSVG from '../../../../images/CatacombsMain-1920x1080px.svg'
import CatacombsBackgroundMobileSVG from '../../../../images/CatacombsMain-414x720px.svg'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Page from '../../../../components/layout/Page'
import InstabuyCard from './InstabuyCard'

const StyledCard = styled(Card)`
  margin: 5%;
  @media (max-width: 479px) {
    margin: 7%;
  }
`

const StyledButton = styled(Button)`
  border: 2px solid white;
  color: white;
`

const StyledDiv = styled.div`
  text-align: center;
  position: relative;
  color: white;
  height: 100%;
  width: 100%;
`

const Container = styled.div`
  text-align: center;
  position: absolute;
  top: 15%;
  width: 25%;
  min-width: 300px;
  height: 50%;
  @media (max-width: 479px) {
    height: 40%;
    top: 2%;
    width: 90%;
    left: 5%;
  }
`

const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`

const StyleCardHeader = styled.div`
  width: 100%;
  height: 300px;
  background: #111820;
`

const StyleCursorPointer = styled.div`
  cursor: pointer;
  display: flex;
  padding-left: 20px;
`

interface DataLabProps {
  modalObj: {modal: boolean, setModal: any};
}

const DataLab: React.FC<DataLabProps>  = ({ modalObj }) => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl

  return (
    <Menu>
      <StyledDiv>
        {isDesktop ? <img src={CatacombsBackgroundDesktopSVG} alt='catacombs-rug-zombie' /> :
          <img src={CatacombsBackgroundMobileSVG} alt='catacombs-rug-zombie' />
        }
        <Flex justifyContent='center'>
        <Container>
          <Page >
              <InstabuyCard id={43} refresh={() => {
                console.log('refresh')
              }} modalObj={modalObj}/>
          </Page>
        </Container>
        </Flex>
      </StyledDiv>
    </Menu>
  )
}

export default DataLab