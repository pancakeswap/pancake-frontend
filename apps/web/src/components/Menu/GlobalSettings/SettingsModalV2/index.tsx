import { useTranslation } from '@pancakeswap/localization'
import { Heading, MotionModal, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useExpertMode, useUserExpertModeAcknowledgement } from '@pancakeswap/utils/user'
import { MotionTabs } from 'components/Motion/MotionTabs'
import { useCallback, useState } from 'react'
import { SettingsMode } from '../types'
import { CustomizeRoutingTab } from './CustomizeRoutingTab'
import { ExpertModeTab } from './ExpertModeTab'
import { RecentTransactionsTab } from './RecentTransactionsTab'
import { SettingsTab } from './SettingsTab'
import { TabContent } from './TabContent'

interface SettingsModalV2Props {
  onDismiss?: () => void
  mode: SettingsMode
}

export const SettingsModalV2 = ({ onDismiss, mode }: SettingsModalV2Props) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()
  const [expertMode, setExpertMode] = useExpertMode()

  const onTabChange = useCallback(
    (index: number) => {
      setActiveTabIndex(index)
    },
    [setActiveTabIndex],
  )

  const renderTabHeading = useCallback(() => {
    switch (activeTabIndex) {
      case 2:
        return (
          <TabContent type="to_right">
            <Heading>{t('Customize Routing')}</Heading>
          </TabContent>
        )
      case 3:
        return (
          <TabContent type="to_right">
            <Heading>{t('Expert Mode')}</Heading>
          </TabContent>
        )

      default:
        return (
          <MotionTabs activeIndex={activeTabIndex} onItemClick={onTabChange}>
            <Text>{t('Settings')}</Text>
            <Text>{t('Recent Transactions')}</Text>
          </MotionTabs>
        )
    }
  }, [activeTabIndex, t, onTabChange])

  const renderTab = useCallback(() => {
    switch (activeTabIndex) {
      case 0:
        return (
          <SettingsTab
            key="settings_tab"
            onCustomizeRoutingClick={() => setActiveTabIndex(2)}
            setShowConfirmExpertModal={(show) => (show ? setActiveTabIndex(3) : setActiveTabIndex(0))}
            showExpertModeAcknowledgement={showExpertModeAcknowledgement}
            expertMode={expertMode}
            setExpertMode={setExpertMode}
          />
        )
      case 1:
        return <RecentTransactionsTab key="recent_txns_tab" />
      case 2:
        return <CustomizeRoutingTab key="customize_routing_tab" />
      case 3:
        return (
          <ExpertModeTab
            key="expert_mode_tab"
            setShowConfirmExpertModal={(show) => (show ? setActiveTabIndex(3) : setActiveTabIndex(0))}
            toggleExpertMode={() => setExpertMode((s) => !s)}
            setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
          />
        )
      default:
        return null
    }
  }, [
    expertMode,
    activeTabIndex,
    showExpertModeAcknowledgement,
    setActiveTabIndex,
    setExpertMode,
    setShowExpertModeAcknowledgement,
  ])

  return (
    <>
      <MotionModal
        minWidth="480px"
        minHeight={isMobile ? '500px' : undefined}
        headerPadding="6px 24px 0"
        title={renderTabHeading()}
        onDismiss={onDismiss}
        onBack={activeTabIndex === 2 || activeTabIndex === 3 ? () => setActiveTabIndex(0) : undefined}
      >
        {renderTab()}
      </MotionModal>
    </>
  )
}
