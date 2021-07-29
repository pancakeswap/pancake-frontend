import React from 'react';
import styled from 'styled-components'
import variables from 'style/variables'
import { useTranslation } from 'contexts/Localization'

const CardWrapper = styled.div`
  .head{
    h2{
        font-size: 24px;
        color: ${variables.secondary};
        margin-bottom: 25px;
    }
   }
   background-color: ${variables.primary};
   padding: 24px;
   border-radius: ${variables.radius};
   h4{
       color: ${variables.secondary};
       margin-bottom: 10px
   }
`

const HighestAPR: React.FC = () => {
    const { t } = useTranslation()
    return(
        <CardWrapper>
            <div>
                <div className='head'>
                    <h2>{t('Earn up to')}</h2>
                </div>
                <div>
                    <h4>55,000%</h4>
                    <h4>{t('APR in farms')}</h4>
                </div>
            </div>
        </CardWrapper>
    )
}

export default HighestAPR;