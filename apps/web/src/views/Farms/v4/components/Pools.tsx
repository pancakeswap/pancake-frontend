import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import { PoolsFilterPanel } from './PoolsFilterPanel'

const PoolsContent = styled.div`
  min-height: calc(100vh - 64px - 56px);
`

export const Pools = () => {
  return (
    <Card>
      <PoolsFilterPanel />
      <PoolsContent />
    </Card>
  )
}
