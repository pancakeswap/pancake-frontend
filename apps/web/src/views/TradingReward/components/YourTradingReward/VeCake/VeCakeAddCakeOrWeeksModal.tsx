import { useTranslation } from '@pancakeswap/localization'
import { ArrowUpDownIcon, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { LockCakeForm } from 'views/CakeStaking/components/LockCakeForm'
import { LockWeeksForm } from 'views/CakeStaking/components/LockWeeksForm'

const StyledSwitchTextContainer = styled(Flex)`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 1;
`

export enum VeCakeModalView {
  CAKE_FORM_VIEW = 'CAKE_FORM_VIEW',
  WEEKS_FORM_VIEW = 'WEEKS_FORM_VIEW',
}

interface VeCakeAddCakeOrWeeksModalProps extends InjectedModalProps {
  viewMode?: VeCakeModalView
  showSwitchButton?: boolean
}

export const VeCakeAddCakeOrWeeksModal: React.FC<React.PropsWithChildren<VeCakeAddCakeOrWeeksModalProps>> = ({
  viewMode,
  showSwitchButton,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const [modalViewMode, setModalViewMode] = useState(VeCakeModalView.CAKE_FORM_VIEW)

  useEffect(() => {
    if (viewMode) {
      setModalViewMode(viewMode)
    }
  }, [])

  const toggleViewMode = () => {
    const mode =
      modalViewMode === VeCakeModalView.CAKE_FORM_VIEW
        ? VeCakeModalView.WEEKS_FORM_VIEW
        : VeCakeModalView.CAKE_FORM_VIEW
    setModalViewMode(mode)
  }

  return (
    <Modal title="Increase your veCAKE" headerBorderColor="transparent" maxWidth={500} onDismiss={onDismiss}>
      {showSwitchButton && (
        <StyledSwitchTextContainer onClick={toggleViewMode}>
          <ArrowUpDownIcon mr="4px" color="primary" style={{ rotate: '90deg' }} />
          <Text bold color="primary">
            {modalViewMode === VeCakeModalView.CAKE_FORM_VIEW ? t('Extend Lock Instead') : t('Add CAKE Instead')}
          </Text>
        </StyledSwitchTextContainer>
      )}
      <Flex position="relative">
        {modalViewMode === VeCakeModalView.CAKE_FORM_VIEW ? (
          <LockCakeForm onDismiss={onDismiss} />
        ) : (
          <LockWeeksForm onDismiss={onDismiss} />
        )}
      </Flex>
      {/* <PreviewOfVeCakeSnapShotTime /> */}
    </Modal>
  )
}
