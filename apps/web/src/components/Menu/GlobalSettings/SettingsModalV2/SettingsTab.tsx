import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, PancakeToggle, PreTitle, QuestionHelper, Text, Toggle } from '@pancakeswap/uikit'
import { useAudioPlay } from '@pancakeswap/utils/user'
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

  ariaId?: string
}

export const SettingsTab = memo(
  ({
    onCustomizeRoutingClick,
    showExpertModeAcknowledgement,
    setShowConfirmExpertModal,
    expertMode,
    setExpertMode,
    ariaId,
  }: SettingsTabProps) => {
    const { t } = useTranslation()
    const { chainId } = useActiveChainId()
    const { onChangeRecipient } = useSwapActionHandlers()
    const [audioPlay, setAudioMode] = useAudioPlay()

    const handleExpertModeToggle = () => {
      if (expertMode || !showExpertModeAcknowledgement) {
        onChangeRecipient(null)
        setExpertMode((s) => !s)
      } else {
        setShowConfirmExpertModal(true)
      }
    }

    return (
      <TabContent id={`${ariaId}_motion-tabpanel-0`} role="tabpanel" aria-labelledby={`${ariaId}_motion-tab-0`}>
        <Flex flexDirection="column">
          <PreTitle mb="8px">{t('Swaps & Liquidity')}</PreTitle>
          {chainId === ChainId.BSC && (
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <GasSettings />
            </Flex>
          )}
          <TransactionSettings />

          <PreTitle>{t('Interface Settings')}</PreTitle>

          <Flex justifyContent="space-between" alignItems="center" mt="8px">
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

          <Flex justifyContent="space-between" alignItems="center" mt="16px">
            <Flex alignItems="center">
              <Text>{t('Flippy sounds')}</Text>
              <QuestionHelper
                text={t('Fun sounds to make a truly immersive pancake-flipping trading experience')}
                placement="top"
                ml="4px"
              />
            </Flex>
            <PancakeToggle
              id="toggle-audio-play"
              checked={audioPlay}
              onChange={() => setAudioMode((s) => !s)}
              scale="md"
            />
          </Flex>
        </Flex>
        <PrimaryOutlineButton
          variant="text"
          mt="12px"
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
