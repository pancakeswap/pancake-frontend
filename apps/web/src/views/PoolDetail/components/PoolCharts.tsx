import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardBody, Column, Container, Tab, TabMenu } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { useRouterQuery } from '../hooks/useRouterQuery'
import { ChartLiquidity } from './ChartLiquidity'
import { ChartVolume } from './ChartVolume'

enum PoolChart {
  Volume = 0,
  Liquidity,
  Fees,
  TVL,
  Donation,
  DynamicFee,
}

const StyledTabMenuContainer = styled(Container)`
  margin: 0;
  margin-top: -16px;
  margin-left: -16px;
`

type PoolChartsProps = {
  poolInfo?: PoolInfo | null
}
export const PoolCharts: React.FC<PoolChartsProps> = ({ poolInfo }) => {
  const { t } = useTranslation()
  const { id } = useRouterQuery()
  const isV4 = useMemo(() => poolInfo?.protocol === 'v4bin', [poolInfo])
  const [chart, setChart] = useState<PoolChart>(PoolChart.Volume)
  return (
    <Column>
      <StyledTabMenuContainer>
        <TabMenu activeIndex={chart} onItemClick={setChart} isShowBorderBottom={false} gap="8px">
          <Tab key={PoolChart.Volume}>
            <Box px="8px">{t('Volume')}</Box>
          </Tab>
          <Tab key={PoolChart.Liquidity}>
            <Box px="8px">{t('Liquidity')}</Box>
          </Tab>
          <Tab key={PoolChart.Fees}>
            <Box px="8px">{t('Fees')}</Box>
          </Tab>
          <Tab key={PoolChart.TVL}>
            <Box px="8px">{t('TVL')}</Box>
          </Tab>
          <>
            {isV4 ? (
              <Tab key={PoolChart.Donation}>
                <Box px="8px">{t('Donation')}</Box>
              </Tab>
            ) : null}
            {isV4 ? (
              <Tab key={PoolChart.DynamicFee}>
                <Box px="8px">{t('Dynamic Fee')}</Box>
              </Tab>
            ) : null}
          </>
        </TabMenu>
      </StyledTabMenuContainer>
      <Card>
        <CardBody>
          {chart === PoolChart.Volume ? <ChartVolume address={id} poolInfo={poolInfo} /> : null}
          {chart === PoolChart.Liquidity ? <ChartLiquidity address={id} poolInfo={poolInfo} /> : null}
          {chart === PoolChart.Fees ? <div>fee</div> : null}
          {chart === PoolChart.TVL ? <div>TVL</div> : null}
        </CardBody>
      </Card>
    </Column>
  )
}
