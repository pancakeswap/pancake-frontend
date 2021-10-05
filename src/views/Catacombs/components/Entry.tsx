import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Text } from '@catacombs-libs/uikit'
import { useModal } from '@rug-zombie-libs/uikit'
import { isMobile } from 'react-device-detect';
import Typewriter from 'typewriter-effect'
import styled from 'styled-components'
import Page from '../../../components/layout/Page'
import CatacombsEntryBackgroundDesktopSVG from '../../../images/CatacombsEntry-1920x1080px.svg'
import CatacombsEntryBackgroundMobileSVG from '../../../images/CatacombsEntry-414x720px.svg'
import BurnZombieConfirmationModal from './BurnZombieConfirmationModal'
import WrongPasswordModal from './WrongPasswordModal'

const StyledText = styled(Text)`
  font-size: 35px;
  color: white;
  @media (max-width: 479px) {
    font-size: 20px;
  }
`

const Entry = () => {
  const { t } = useTranslation()

  const [onBurnZombie] = useModal(
    <BurnZombieConfirmationModal />,
  );

  const [onWrongPassword] = useModal(<WrongPasswordModal/>);

  const Input = () => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (event.target.value === 'nozombie') {
          onBurnZombie()
        } else {
          onWrongPassword()
        }
      }
    }
    // eslint-disable-next-line jsx-a11y/no-autofocus
    return <input type='password' className='password-input' onKeyDown={handleKeyDown} maxLength={8} autoFocus />
  }
  return (
    <>
      <Page>
        <div className='parent-div'>
          { 
            isMobile ? <img src={CatacombsEntryBackgroundMobileSVG} alt='catacombs-rug-zombie' className='backgroundImageStyle' /> :
            <img src={CatacombsEntryBackgroundDesktopSVG} alt='catacombs-rug-zombie' className='backgroundImageStyle' />
          }
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
          <div className='password'>
            <Input />
          </div>
        </div>
      </Page>
    </>
  )
}

export default Entry
