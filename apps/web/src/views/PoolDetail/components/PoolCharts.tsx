import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardBody, Column, Container, Tab, TabMenu } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'

enum PoolChart {
  Volume,
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
  const isV4 = useMemo(() => poolInfo?.protocol === 'v4bin', [poolInfo])
  return (
    <Column>
      <StyledTabMenuContainer>
        <TabMenu isShowBorderBottom={false} gap="8px">
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
        <CardBody>12</CardBody>
      </Card>
    </Column>
  )
}
