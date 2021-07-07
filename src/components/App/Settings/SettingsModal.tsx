import React, { useState } from 'react'
import { Button, Text, PancakeToggle, Flex, Message, Modal, ModalBody, InjectedModalProps } from '@pancakeswap/uikit'
import {
  useAudioModeManager,
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
} from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'

import { useSwapActionHandlers } from 'state/swap/hooks'
import { AutoColumn } from '../../Layout/Column'
import QuestionHelper from '../../QuestionHelper'
import { RowBetween, RowFixed } from '../../Layout/Row'
import TransactionSettings from './TransactionSettings'

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()

  if (showConfirmExpertModal) {
    return (
      <Modal
        title={t('Are you sure?')}
        onBack={() => setShowConfirmExpertModal(false)}
        onDismiss={onDismiss}
        style={{ maxWidth: '420px' }}
      >
        <ModalBody>
          <Message variant="warning" mb="24px">
            <Text>
              {t(
                "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
              )}
            </Text>
          </Message>
          <Text mb="24px">{t('Only use this mode if you know what you’re doing.')}</Text>
          <Button
            variant="danger"
            id="confirm-expert-mode"
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                toggleExpertMode()
                setShowConfirmExpertModal(false)
              }
            }}
          >
            {t('Turn On Expert Mode')}
          </Button>
        </ModalBody>
      </Modal>
    )
  }

  return (
    <Modal title="Settings" headerBackground="gradients.cardHeader" onDismiss={onDismiss}>
      <ModalBody>
        <AutoColumn gap="md" style={{ padding: '1rem' }}>
          <Text bold fontSize="20px">
            {t('Transaction Settings')}
          </Text>
          <TransactionSettings
            rawSlippage={userSlippageTolerance}
            setRawSlippage={setUserslippageTolerance}
            deadline={ttl}
            setDeadline={setTtl}
          />
          <Text bold fontSize="20px" mt="32px">
            {t('Interface Settings')}
          </Text>
          <RowBetween>
            <RowFixed>
              <Text fontSize="14px">{t('Toggle Expert Mode')}</Text>
              <QuestionHelper
                text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                ml="4px"
              />
            </RowFixed>
            <PancakeToggle
              id="toggle-expert-mode-button"
              checked={expertMode}
              onChange={
                expertMode
                  ? () => {
                      onChangeRecipient(null)
                      toggleExpertMode()
                    }
                  : () => setShowConfirmExpertModal(true)
              }
            />
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text fontSize="14px">{t('Disable Multihops')}</Text>
              <QuestionHelper text={t('Restricts swaps to direct pairs only.')} ml="4px" />
            </RowFixed>
            <PancakeToggle
              id="toggle-disable-multihop-button"
              checked={singleHopOnly}
              onChange={() => {
                setSingleHopOnly(!singleHopOnly)
              }}
            />
          </RowBetween>
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <RowFixed>
              <Text fontSize="14px">{t('Audio')}</Text>
              <QuestionHelper text={t('🐰 Turn down your volume a bit before you swap')} ml="4px" />
            </RowFixed>
            <PancakeToggle checked={audioPlay} onChange={toggleSetAudioMode} />
          </Flex>
        </AutoColumn>
      </ModalBody>
    </Modal>
  )
}

export default SettingsModal
