import React from "react"
import {Card,Heading,Button} from "@rug-zombie-libs/uikit"
import styled from "styled-components"
import { useTranslation } from "contexts/Localization"


const StyledGraveyardCard = styled(Card)`
  background-image: url('/images/zmbe-bg.png');
  background-size: 400px 400px;
  background-position-x: 100px;
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 70px;
`

const GraveyardCard: React.FC = () => {
    const {t} = useTranslation()
    return(
        <StyledGraveyardCard>
            <Heading size="xl" m="10px">
                {t('Stake for NFT and ZMBE')}
            </Heading>
            <Button mt="10px" mx="10px" external href="/graves" as="a">    
                {t('Graves')}
            </Button>
        </StyledGraveyardCard>
    )
}

export default GraveyardCard