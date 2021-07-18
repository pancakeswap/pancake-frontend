import React from "react"
import { Card, CardBody, Heading, } from "@rug-zombie-libs/uikit"
import { useTranslation } from "contexts/Localization"
import styled from "styled-components"


const StyledNFTBanner = styled(Card)`
  background-image: url('/images/zmbe-bg.png');
  background-size: 400px 400px;
  background-position-x: 100px;
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 100px;
  margin-bottom: 10px;
  border-radius: 0;
`
const NFTBanner: React.FC = () => {
    const { t } = useTranslation()
    return(
        <StyledNFTBanner>
            <CardBody>
            <Heading size="xl" mb="24px">
                {t('1st NFT Auction Starting Soon')}
            </Heading>
            <div>
                <a href="https://rugzombie.medium.com/new-feature-alert-introducing-the-mausoleum-4867bb4bdcbb" target="_blank" rel="noreferrer">
                    {t('Learn More')}
                </a>
            </div>
            </CardBody>
        </StyledNFTBanner>
    )
}
export default NFTBanner