import { useTranslation } from '@pancakeswap/localization'
import { domAnimation, Heading, LazyAnimatePresence, Modal, Text } from '@pancakeswap/uikit'
import { MotionTabs } from 'components/Motion/MotionTabs'
import { useCallback, useState } from 'react'
import { SettingsMode } from '../types'
import { CustomizeRoutingTab } from './CustomizeRoutingTab'
import { RecentTransactionsTab } from './RecentTransactionsTab'
import { SettingsTab } from './SettingsTab'
import { TabContent } from './TabContent'

interface SettingsModalV2Props {
  onDismiss?: () => void
  mode: SettingsMode
}

export const SettingsModalV2 = ({ onDismiss, mode }: SettingsModalV2Props) => {
  const { t } = useTranslation()
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const onTabChange = useCallback(
    (index: number) => {
      setActiveTabIndex(index)
    },
    [setActiveTabIndex],
  )

  const renderTab = useCallback(() => {
    switch (activeTabIndex) {
      case 0:
        return <SettingsTab key="settings_tab" onClickCustomizeRouting={() => setActiveTabIndex(2)} />
      case 1:
        return <RecentTransactionsTab key="recent_txns_tab" />
      case 2:
        return <CustomizeRoutingTab key="customize_routing_tab" />
      default:
        return null
    }
  }, [activeTabIndex, setActiveTabIndex])

  return (
    <>
      <Modal
        minWidth="480px"
        headerPadding="0px"
        title={
          activeTabIndex === 2 ? (
            <TabContent type="to_right">
              <Heading>{t('Customize Routing')}</Heading>
            </TabContent>
          ) : (
            <MotionTabs activeIndex={activeTabIndex} onItemClick={onTabChange}>
              <Text>{t('Settings')}</Text>
              <Text>{t('Recent Transactions')}</Text>
            </MotionTabs>
          )
        }
        onDismiss={onDismiss}
        onBack={activeTabIndex === 2 ? () => setActiveTabIndex(0) : undefined}
      >
        <LazyAnimatePresence features={domAnimation} mode="wait">
          {renderTab()}
        </LazyAnimatePresence>
      </Modal>
    </>
  )
}
