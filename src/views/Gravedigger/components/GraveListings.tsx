import React from 'react'
import { Card,Text,Heading } from "@rug-zombie-libs/uikit"
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { graves } from 'redux/get'
import CurrentGraves from './CurrentGraves'

const Container = styled(Card)`
  box-shadow: rgb(204 246 108) 0px 0px 20px;
`
const GraveListings:React.FC = () => {
    const { t } = useTranslation()
    return (
        <Container>
            <Heading>
                <Text fontSize="70px" textAlign="center">
                    {t('Current Graves')}
                </Text>
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