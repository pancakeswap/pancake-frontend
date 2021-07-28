import React from 'react';
import styled from 'styled-components'
import variables from 'style/variables'
import { useTranslation } from 'contexts/Localization'

const CardWrapper = styled.div`
  .head{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    h2{
        font-size: 24px;
        color: ${variables.secondary};
        margin-bottom: 35px;
    }
   }
   background-color: ${variables.primary};
   padding: 24px;
   border-radius: ${variables.radius};
`

const FarmsStackingCards: React.FC = () => {
    const { t } = useTranslation()
    return(
        <CardWrapper>
            <div>
                <div className='head'>
                    <h2>{t('Announcements')}</h2>
                    <img src={`${process.env.PUBLIC_URL}/images/home/info.svg`} alt='info'/>
                </div>
                <div className='feed'>
                    <img src={`${process.env.PUBLIC_URL}/images/home/feed.svg`} alt='info'/>
                </div>
            </div>
        </CardWrapper>
    )
}

export default FarmsStackingCards;