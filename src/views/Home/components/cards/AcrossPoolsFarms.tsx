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
   .earns{
       font-size: 40px
   }
`

const AcrossPoolsFarms: React.FC = () => {
    const { t } = useTranslation()
    return(
        <CardWrapper>
            <div>
                <div className='head'>
                    <h2>{t('Earn up to')}</h2>
                </div>
                <div>
                    <h4 className='earns'>$1,000,000</h4>
                    <h4>{t('Across all pools and farms')}</h4>
                </div>
            </div>
        </CardWrapper>
    )
}

export default AcrossPoolsFarms;