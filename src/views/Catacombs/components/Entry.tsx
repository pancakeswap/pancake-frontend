import { useTranslation } from 'contexts/Localization'
import React from 'react'
import Typewriter from 'typewriter-effect'
import { Heading, Text } from '@catacombs-libs/uikit'
import styled from 'styled-components'
import Menu from '../../../components/Catacombs/Menu'
import Page from '../../../components/layout/Page'
import CatacombsEntryBackgroundSVG from '../../../images/Catacombs_Entry_650_x_650_px.svg'

const StyledHeading = styled(Heading)`
  font-size: 40px;
  font-weight: 600;
`
const StyledText = styled(Text)`
  font-size: 35px;
  color: white;
  @media (max-width: 479px) {
    font-size: 20px;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Entry = () => {
  const { t } = useTranslation()
  return (
    <>
      <Page>
        <div className='parent-div'>
          <img src={CatacombsEntryBackgroundSVG} alt='catacombs-rug-zombie' className="backgroundImageStyle" />
          <div className='main-text'>
            <Typewriter options={{ cursor: '' }}
                        onInit={(typewriter) => {
                          typewriter
                            .pauseFor(150)
                            .changeDelay(50)
                            .typeString(
                              '<p class="text-size">You found the black market.' +
                              '<br><br>Clever humans have been hiding in the catacombs for years.' +
                              '<br><br>Enter at your own risk.</p>',
                            )
                            .start()
                        }}
            />
          </div>
          <div className='enter-password'>
            <StyledText>
              {t('Enter Password : ')}
            </StyledText>
          </div>
        </div>
      </Page>
    </>
  )
}

export default Entry
