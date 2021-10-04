import { useTranslation } from 'contexts/Localization'
import React, { useState } from 'react'
import { Text } from '@catacombs-libs/uikit'
import { useModal } from '@rug-zombie-libs/uikit';
import Typewriter from 'typewriter-effect'
import styled from 'styled-components'
import Page from '../../../components/layout/Page'
import CatacombsEntryBackgroundSVG from '../../../images/Catacombs_Entry_650_x_650_px.svg'
import { useCatacombsContract, useZombie } from '../../../hooks/useContract'
import BurnZombieModal from '../../Graves/components/BurnZombie'
import BurnZombieConfirmationModal from './BurnZombieConfirmationModal'

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

  const Input = () => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && event.target.value === 'nozombie') {
        console.log('password entered')
        onBurnZombie()
      }
    }
    // eslint-disable-next-line jsx-a11y/no-autofocus
    return <input type='password' className='password-input' onKeyDown={handleKeyDown} maxLength={8} autoFocus />
  }
  return (
    <>
      <Page>
        <div className='parent-div'>
          <img src={CatacombsEntryBackgroundSVG} alt='catacombs-rug-zombie' className='backgroundImageStyle' />
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
