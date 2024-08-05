import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardBody, Column, Container, Tab, TabMenu } from '@pancakeswap/uikit'
import { useMemo, useState } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { useRouterQuery } from '../hooks/useRouterQuery'
import { ChartFee } from './ChartFee'
import { ChartLiquidity } from './ChartLiquidity'
import { ChartTVL } from './ChartTVL'
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

const CustomTab = styled(Tab)<{ $enable?: boolean }>`
  ${({ $enable }) => !$enable && 'display: none;'}
`

type PoolChartsProps = {
  poolInfo?: PoolInfo | null
}
export const PoolCharts: React.FC<PoolChartsProps> = ({ poolInfo }) => {
  const { t } = useTranslation()
  const { id } = useRouterQuery()
  const isV4 = useMemo(() => poolInfo?.protocol === 'v4bin', [poolInfo])
  const isV3 = useMemo(() => poolInfo?.protocol === 'v3', [poolInfo])
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

          <CustomTab key={PoolChart.Fees} $enable={isV3}>
            <Box px="8px">{t('Fees')}</Box>
          </CustomTab>
          <CustomTab key={PoolChart.TVL} $enable={isV3}>
            <Box px="8px">{t('TVL')}</Box>
          </CustomTab>

          <CustomTab key={PoolChart.Donation} $enable={isV4}>
            <Box px="8px">{t('Donation')}</Box>
          </CustomTab>
          <CustomTab key={PoolChart.DynamicFee} $enable={isV4}>
            <Box px="8px">{t('Dynamic Fee')}</Box>
          </CustomTab>
        </TabMenu>
      </StyledTabMenuContainer>
      <Card>
        <CardBody>
          {chart === PoolChart.Volume ? <ChartVolume address={id} poolInfo={poolInfo} /> : null}
          {chart === PoolChart.Liquidity ? <ChartLiquidity address={id} poolInfo={poolInfo} /> : null}
          {chart === PoolChart.Fees ? <ChartFee address={id} /> : null}
          {chart === PoolChart.TVL ? <ChartTVL address={id} poolInfo={poolInfo} /> : null}
        </CardBody>
      </Card>
    </Column>
  )
}
