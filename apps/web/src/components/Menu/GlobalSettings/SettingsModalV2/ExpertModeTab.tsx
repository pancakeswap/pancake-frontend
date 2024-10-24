import { useTranslation } from '@pancakeswap/localization'
import { Button, Checkbox, Flex, Message, Text, usePrompt } from '@pancakeswap/uikit'
import { memo, useCallback, useState } from 'react'
import { TabContent } from './TabContent'

interface ExpertModeTabProps {
  setShowConfirmExpertModal: (show: boolean) => void
  setShowExpertModeAcknowledgement: (show: boolean) => void
  toggleExpertMode: () => void
}

export const ExpertModeTab = memo(
  ({ setShowConfirmExpertModal, setShowExpertModeAcknowledgement, toggleExpertMode }: ExpertModeTabProps) => {
    const { t } = useTranslation()
    const prompt = usePrompt()
    const [isRememberChecked, setIsRememberChecked] = useState(false)

    const onPromptConfirm = useCallback(
      (value: string) => {
        if (value === 'confirm') {
          toggleExpertMode()
          setShowConfirmExpertModal(false)
          if (isRememberChecked) {
            setShowExpertModeAcknowledgement(false)
          }
        }
      },
      [toggleExpertMode, setShowConfirmExpertModal, isRememberChecked, setShowExpertModeAcknowledgement],
    )
    const handlePrompt = useCallback(() => {
      prompt({
        message: 'Please type the word "confirm" to enable expert mode.',
        onConfirm: onPromptConfirm,
      })
    }, [onPromptConfirm, prompt])

    return (
      <TabContent type="to_right" mx="auto" maxWidth="480px">
        <Message variant="warning" mb="24px">
          <Text>
            {t(
              "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
            )}
          </Text>
        </Message>
        <Text mb="24px">{t('Only use this mode if you know what you’re doing.')}</Text>
        <Flex alignItems="center" mb="24px">
          <Checkbox
            name="confirmed"
            type="checkbox"
            checked={isRememberChecked}
            onChange={() => setIsRememberChecked(!isRememberChecked)}
            scale="sm"
          />
          <Text ml="10px" color="textSubtle" style={{ userSelect: 'none' }}>
            {t('Don’t show this again')}
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Button mb="8px" id="confirm-expert-mode" onClick={handlePrompt}>
            {t('Turn On Expert Mode')}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirmExpertModal(false)
            }}
          >
            {t('Cancel')}
          </Button>
        </Flex>
      </TabContent>
    )
  },
)
