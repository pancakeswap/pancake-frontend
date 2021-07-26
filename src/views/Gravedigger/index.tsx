import React,{ useEffect } from "react"
import Header from "components/Landing/Header"
import styled from "styled-components"
import { Flex,Text } from "@rug-zombie-libs/uikit"
import { useTranslation } from "contexts/Localization"
import { createWidget } from '@typeform/embed'
import Page from '../../components/layout/Page'
import '@typeform/embed/build/css/widget.css'
import GraveListings from "./components/GraveListings"

const Wrapper = styled.div`
  margin-top:100px;
  max-height: max-content;
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 256px;
  }
`
const FormContainer = styled.div`
  margin: 20px;
  height: 700px;
`
const StyledFlex = styled(Flex)`
  justify-content: center;
`

const Row = styled.div`
    display:flex;
`
const Col = styled.div`
    flex: 1;
    padding: 10px;
`
const Gravedigger:React.FC = () => {
    const { t } = useTranslation()
    useEffect(() => {
        createWidget("LKwVHkPz",{container: document.querySelector("#form")})
    })
    return(
        <>
        <Header />
        <Wrapper>
            <StyledFlex>
                <a href="https://euler.tools/" target="_blank" rel="noreferrer">
                <Text color='white' bold fontSize='50px' mr='4px'>
                    {t('Explore on Euler Tools')}
                </Text>
                </a>
            </StyledFlex>
            <Row>
                <Col>
                    <GraveListings/>
                </Col>
                <Col>
                    <GraveListings/>
                </Col>
            </Row>
            <FormContainer id="form" />
        </Wrapper>
        </>
    )
}

export default Gravedigger