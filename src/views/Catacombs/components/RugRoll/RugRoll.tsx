import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { isMobile } from 'react-device-detect';
import styled from 'styled-components'
import Menu from '../../../../components/Catacombs/Menu'
import Page from '../../../../components/layout/Page'
import CatacombsBackgroundDesktopSVG from '../../../../images/CatacombsMain-1920x1080px.svg'
import CatacombsBackgroundMobileSVG from '../../../../images/CatacombsMain-414x720px.svg'


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

const RugRoll: React.FC = () => {
    const { t } = useTranslation()
    return (
        <div>
            RugRoll is working!
        </div>
    )
}

export default RugRoll