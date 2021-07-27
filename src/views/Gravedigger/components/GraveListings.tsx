import React from 'react'
import { Card,Text,Heading } from "@rug-zombie-libs/uikit"
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { graves } from 'redux/get'
import CurrentGraves from './CurrentGraves'

const Container = styled(Card)`
  background-size: 300px 300px;
  background-position-x: 100px;
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
  box-shadow: rgb(204 246 108) 0px 0px 20px;
`
const GraveListings:React.FC = () => {
    const { t } = useTranslation()
    return (
        <Container>
            <Heading size='xl' mb='24px' textAlign="center" paddingTop="20px">
                    {t('Current Graves')}
            </Heading>
            {graves().map((g) => {
                return(
                   <CurrentGraves grave={g}/>
                )
            })}
        </Container>
    )
}

export default GraveListings