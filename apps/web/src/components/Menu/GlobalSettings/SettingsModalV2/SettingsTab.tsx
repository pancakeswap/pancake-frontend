import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, PreTitle, QuestionHelper, Text, Toggle } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { memo } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import GasSettings from '../GasSettings'
import { PrimaryOutlineButton } from '../styles'
import TransactionSettings from '../TransactionSettings'
import { TabContent } from './TabContent'

interface SettingsTabProps {
  onCustomizeRoutingClick?: () => void
  showExpertModeAcknowledgement: boolean
  setShowConfirmExpertModal: (show: boolean) => void
  expertMode: boolean
  setExpertMode: (expertMode: any) => void
}

export const SettingsTab = memo(
  ({
    onCustomizeRoutingClick,
    showExpertModeAcknowledgement,
    setShowConfirmExpertModal,
    expertMode,
    setExpertMode,
  }: SettingsTabProps) => {
    const { t } = useTranslation()
    const { chainId } = useActiveChainId()
    const { onChangeRecipient } = useSwapActionHandlers()

    const handleExpertModeToggle = () => {
      if (expertMode || !showExpertModeAcknowledgement) {
        onChangeRecipient(null)
        setExpertMode((s) => !s)
      } else {
        setShowConfirmExpertModal(true)
      }
    }

    return (
      <TabContent>
        <Flex flexDirection="column">
          <PreTitle>{t('Swaps & Liquidity')}</PreTitle>
          <Flex justifyContent="space-between" alignItems="center" mt="8px" mb="24px">
            {chainId === ChainId.BSC && <GasSettings />}
          </Flex>
          <TransactionSettings />

          <PreTitle>{t('Interface Settings')}</PreTitle>

          <Flex justifyContent="space-between" alignItems="center" mt="4px" mb="24px">
            <Flex alignItems="center">
              <Text>{t('Expert Mode')}</Text>
              <QuestionHelper
                text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle id="toggle-expert-mode-button" scale="md" checked={expertMode} onChange={handleExpertModeToggle} />
          </Flex>
        </Flex>
        <PrimaryOutlineButton
          variant="text"
          mt="auto"
          $height="48px"
          width="100%"
          onClick={() => onCustomizeRoutingClick?.()}
        >
          {t('Customize Routing')}
        </PrimaryOutlineButton>
      </TabContent>
    )
  },
)
