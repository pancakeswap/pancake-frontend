import { useTranslation } from "contexts/Localization"
import React from "react"
import {Heading,Text} from "@rug-zombie-libs/uikit"
import styled from "styled-components"

const StyledHeading = styled(Heading)`
    font-size: 40px;
    font-weight: 600;
`
const StyledText = styled(Text)`
    font-size : 16px;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Title = () => {
    const {t} = useTranslation()
    return (
        <>
        <Container>
                <StyledHeading>{t('Rug Zombie')}</StyledHeading>
        </Container>
        <Container>
                <StyledText>
                    {t('The best NFT/yield farm on Binance Smart Chain')}
                </StyledText>
        </Container>
        </>
    )

}

export default Title