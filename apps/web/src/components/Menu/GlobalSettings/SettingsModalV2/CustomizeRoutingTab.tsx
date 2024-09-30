import { Text } from '@pancakeswap/uikit'
import { memo } from 'react'
import { TabContent } from './TabContent'

export const CustomizeRoutingTab = memo(() => {
  return (
    <TabContent type="to_right">
      <Text>Customize Routing</Text>
    </TabContent>
  )
})
