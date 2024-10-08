import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Heading, MotionModal, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useExpertMode, useUserExpertModeAcknowledgement } from '@pancakeswap/utils/user'
import { MotionTabs } from 'components/Motion/MotionTabs'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { TabContent } from './TabContent'

const SettingsTab = dynamic(() => import('./SettingsTab').then((mod) => mod.SettingsTab), {
  ssr: false,
})
const RecentTransactionsTab = dynamic(
  () => import('./RecentTransactionsTab').then((mod) => mod.RecentTransactionsTab),
  {
    ssr: false,
  },
)
const CustomizeRoutingTab = dynamic(() => import('./CustomizeRoutingTab').then((mod) => mod.CustomizeRoutingTab), {
  ssr: false,
})
const ExpertModeTab = dynamic(() => import('./ExpertModeTab').then((mod) => mod.ExpertModeTab), {
  ssr: false,
})

enum TabIndex {
  SETTINGS = 0,
  RECENT_TRANSACTIONS = 1,
  CUSTOMIZE_ROUTING = 2,
  EXPERT_MODE = 3,
}

interface SettingsModalV2Props {
  onDismiss?: () => void
}

export const SettingsModalV2 = ({ onDismiss }: SettingsModalV2Props) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()
  const [expertMode, setExpertMode] = useExpertMode()
  const [isRoutingSettingChange, reset] = useRoutingSettingChanged()

  const [activeTabIndex, setActiveTabIndex] = useState<TabIndex>(TabIndex.SETTINGS)

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
          <MotionTabs activeIndex={activeTabIndex} onItemClick={onTabChange} animateOnMobile={false}>
            <Text>{t('Settings')}</Text>
            <Text>{t('Recent Transactions')}</Text>
          </MotionTabs>
        )
    }
  }, [activeTabIndex, t, onTabChange])

  const renderTab = useCallback(() => {
    switch (activeTabIndex) {
      case TabIndex.SETTINGS: {
        return (
          <SettingsTab
            key="settings_tab"
            onCustomizeRoutingClick={() => setActiveTabIndex(TabIndex.CUSTOMIZE_ROUTING)}
            setShowConfirmExpertModal={(show) =>
              show ? setActiveTabIndex(TabIndex.EXPERT_MODE) : setActiveTabIndex(TabIndex.SETTINGS)
            }
            showExpertModeAcknowledgement={showExpertModeAcknowledgement}
            expertMode={expertMode}
            setExpertMode={setExpertMode}
          />
        )
      }
      case TabIndex.RECENT_TRANSACTIONS:
        return <RecentTransactionsTab key="recent_txns_tab" />
      case TabIndex.CUSTOMIZE_ROUTING:
        return <CustomizeRoutingTab key="customize_routing_tab" />
      case TabIndex.EXPERT_MODE:
        return (
          <ExpertModeTab
            key="expert_mode_tab"
            setShowConfirmExpertModal={(show) =>
              show ? setActiveTabIndex(TabIndex.EXPERT_MODE) : setActiveTabIndex(TabIndex.SETTINGS)
            }
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
    <MotionModal
      minWidth="420px"
      minHeight={isMobile ? '500px' : undefined}
      headerPadding="6px 24px 0"
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
