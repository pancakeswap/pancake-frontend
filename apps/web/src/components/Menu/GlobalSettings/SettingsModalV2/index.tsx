import { useTranslation } from '@pancakeswap/localization'
import {
  AtomBox,
  Box,
  Button,
  ButtonProps,
  Flex,
  Heading,
  ModalV2,
  MotionModal,
  MotionTabMenu,
  NotificationDot,
  Text,
  useMatchBreakpoints,
  useModalV2,
} from '@pancakeswap/uikit'
import { useExpertMode, useUserExpertModeAcknowledgement } from '@pancakeswap/utils/user'

import { ReactNode, useCallback, useId, useState } from 'react'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import SettingsModal from '../SettingsModal'
import { SettingsMode } from '../types'
import { CustomizeRoutingTab } from './CustomizeRoutingTab'
import { ExpertModeTab } from './ExpertModeTab'
import { RecentTransactionsTab } from './RecentTransactionsTab'
import { SettingsTab } from './SettingsTab'
import { TabContent } from './TabContent'

enum TabIndex {
  SETTINGS = 0,
  RECENT_TRANSACTIONS = 1,
  CUSTOMIZE_ROUTING = 2,
  EXPERT_MODE = 3,
}

interface SettingsModalV2Props {
  /**
   * Tab Index:
   * (0) Settings |
   * (1) Recent Transactions |
   * (2) Customize Routing |
   * (3) Expert Mode
   */
  defaultTabIndex?: TabIndex

  mode?: SettingsMode
  onDismiss?: () => void
}

export const SettingsModalV2 = ({
  onDismiss,
  mode = SettingsMode.SWAP_LIQUIDITY,
  defaultTabIndex = TabIndex.SETTINGS,
}: SettingsModalV2Props) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()
  const [expertMode, setExpertMode] = useExpertMode()
  const [isRoutingSettingChange, reset] = useRoutingSettingChanged()

  const [activeTabIndex, setActiveTabIndex] = useState<TabIndex>(defaultTabIndex)

  const { onDismiss: onDismissGlobalSettings } = useModalV2()

  const ariaId = useId()

  const onTabChange = useCallback(
    (index: TabIndex) => {
      setActiveTabIndex(index)
    },
    [setActiveTabIndex],
  )

  const renderTabHeading = useCallback(() => {
    switch (activeTabIndex) {
      case TabIndex.CUSTOMIZE_ROUTING:
        return (
          <TabContent type="to_right">
            <Flex alignItems="center">
              <Heading>{t('Customize Routing')}</Heading>
            </Flex>
          </TabContent>
        )
      case TabIndex.EXPERT_MODE:
        return (
          <TabContent type="to_right">
            <Heading>{t('Expert Mode')}</Heading>
          </TabContent>
        )

      default:
        return (
          <Box mb="-5px">
            <MotionTabMenu
              activeIndex={activeTabIndex}
              onItemClick={onTabChange}
              animateOnMobile={false}
              ariaId={ariaId}
              autoFocus
            >
              <Text>{t('Settings')}</Text>
              <Text>{t('Recent Transactions')}</Text>
            </MotionTabMenu>
          </Box>
        )
    }
  }, [activeTabIndex, t, onTabChange, ariaId])

  const renderTab = useCallback(() => {
    switch (activeTabIndex) {
      case TabIndex.SETTINGS: {
        return (
          <SettingsTab
            key="settings_tab"
            onCustomizeRoutingClick={() => setActiveTabIndex(TabIndex.CUSTOMIZE_ROUTING)}
            setShowConfirmExpertModal={(show) => setActiveTabIndex(show ? TabIndex.EXPERT_MODE : TabIndex.SETTINGS)}
            showExpertModeAcknowledgement={showExpertModeAcknowledgement}
            expertMode={expertMode}
            setExpertMode={setExpertMode}
            ariaId={ariaId}
          />
        )
      }
      case TabIndex.RECENT_TRANSACTIONS:
        return <RecentTransactionsTab key="recent_txns_tab" ariaId={ariaId} />
      case TabIndex.CUSTOMIZE_ROUTING:
        return <CustomizeRoutingTab key="customize_routing_tab" />
      case TabIndex.EXPERT_MODE:
        return (
          <ExpertModeTab
            key="expert_mode_tab"
            setShowConfirmExpertModal={(show) => setActiveTabIndex(show ? TabIndex.EXPERT_MODE : TabIndex.SETTINGS)}
            toggleExpertMode={() => setExpertMode((s) => !s)}
            setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
          />
        )
      default:
        return null
    }
  }, [
    ariaId,
    expertMode,
    activeTabIndex,
    showExpertModeAcknowledgement,
    setActiveTabIndex,
    setExpertMode,
    setShowExpertModeAcknowledgement,
  ])

  // For Global Settings, show existing modal
  if (mode === SettingsMode.GLOBAL) {
    return <SettingsModal onDismiss={onDismissGlobalSettings} mode={SettingsMode.GLOBAL} />
  }

  return (
    <MotionModal
      minWidth={[null, null, '420px']}
      minHeight={isMobile ? '500px' : undefined}
      headerPadding="2px 14px 0 24px"
      headerRightSlot={
        activeTabIndex === TabIndex.CUSTOMIZE_ROUTING &&
        isRoutingSettingChange && (
          <TabContent type="to_right">
            <Button ml="8px" variant="text" scale="sm" onClick={reset}>
              {t('Reset')}
            </Button>
          </TabContent>
        )
      }
      title={renderTabHeading()}
      onDismiss={onDismiss}
      onBack={
        activeTabIndex === TabIndex.CUSTOMIZE_ROUTING || activeTabIndex === TabIndex.EXPERT_MODE
          ? () => setActiveTabIndex(TabIndex.SETTINGS)
          : undefined
      }
    >
      {renderTab()}
    </MotionModal>
  )
}

export function RoutingSettingsButton({
  children,
  showRedDot = true,
  buttonProps,
}: {
  children?: ReactNode
  showRedDot?: boolean
  buttonProps?: ButtonProps
}) {
  const { t } = useTranslation()
  const { isOpen, setIsOpen, onDismiss } = useModalV2()
  const [isRoutingSettingChange] = useRoutingSettingChanged()

  return (
    <>
      <AtomBox textAlign="center">
        <NotificationDot show={isRoutingSettingChange && showRedDot}>
          <Button variant="text" onClick={() => setIsOpen(true)} scale="sm" {...buttonProps}>
            {children || t('Customize Routing')}
          </Button>
        </NotificationDot>
      </AtomBox>
      <ModalV2 isOpen={isOpen} onDismiss={onDismiss} closeOnOverlayClick>
        <SettingsModalV2 defaultTabIndex={2} onDismiss={onDismiss} />
      </ModalV2>
    </>
  )
}

export const withCustomOnDismiss =
  (Component) =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }
