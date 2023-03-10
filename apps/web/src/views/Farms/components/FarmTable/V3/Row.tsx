import { useEffect, useState, createElement, useRef } from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import {
  Flex,
  useMatchBreakpoints,
  Farm as FarmUI,
  FarmTableEarnedProps,
  FarmTableLiquidityProps,
  FarmTableMultiplierProps,
  FarmTableFarmTokenInfoProps,
  MobileColumnSchema,
  DesktopColumnSchema,
  FarmTableAmountProps,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useFarmUser } from 'state/farms/hooks'
import { useDelayedUnmount } from '@pancakeswap/hooks'
import Apr, { AprProps } from '../Apr'
import Farm from '../Farm'
import ActionPanel from './Actions/ActionPanel'

const { CellLayout, Details, Multiplier, Liquidity, Earned, LpAmount } = FarmUI.FarmTable

export interface RowProps {
  apr: AprProps
  farm: FarmTableFarmTokenInfoProps
  earned: FarmTableEarnedProps
  multiplier: FarmTableMultiplierProps
  liquidity: FarmTableLiquidityProps
  details: FarmWithStakedValue
  type: 'core' | 'community'
  initialActivity?: boolean
  availableLp: FarmTableAmountProps
  stakedLp: FarmTableAmountProps
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
  availableLp: LpAmount,
  stakedLp: LpAmount,
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 14px;
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`

const Row: React.FunctionComponent<React.PropsWithChildren<RowPropsWithLoading>> = (props) => {
  const { details, initialActivity, userDataReady } = props
  const hasSetInitialValue = useRef(false)
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  const { t } = useTranslation()

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])
  useEffect(() => {
    if (initialActivity && hasSetInitialValue.current === false) {
      setActionPanelExpanded(initialActivity)
      hasSetInitialValue.current = true
    }
  }, [initialActivity])

  const { isDesktop, isMobile } = useMatchBreakpoints()

  const isSmallerScreen = !isDesktop
  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key)
            if (columnIndex === -1) {
              return null
            }

            switch (key) {
              case 'details':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelExpanded} />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'apr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('APR')}>
                        {/* <Apr
                          {...props.apr}
                          hideButton={isSmallerScreen}
                          strikethrough={props?.details?.boosted}
                          boosted={props?.details?.boosted}
                        /> */}
                        APY BUTTON
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t(tableSchema[columnIndex].label)}>
                        {createElement(cells[key], { ...props[key], userDataReady })}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
            }
          })}
        </StyledTr>
      )
    }

    return (
      <>
        <tr style={{ cursor: 'pointer' }} onClick={toggleActionPanel}>
          <FarmMobileCell colSpan={3}>
            <Flex justifyContent="space-between" alignItems="center">
              <Farm {...props.farm} />
            </Flex>
          </FarmMobileCell>
        </tr>
        <StyledTr onClick={toggleActionPanel}>
          <td width="20%">
            <EarnedMobileCell>
              <CellLayout label={t('Earned')}>
                <Earned {...props.earned} userDataReady={userDataReady} />
              </CellLayout>
            </EarnedMobileCell>
          </td>
          <td width="35%">
            <AprMobileCell>
              <CellLayout label={t('APR')}>
                {/* <Apr
                  {...props.apr}
                  hideButton
                  strikethrough={props?.details?.boosted}
                  boosted={props?.details?.boosted}
                /> */}
                APY BUTTON
              </CellLayout>
            </AprMobileCell>
          </td>
          <td width="15%">
            <CellInner style={{ justifyContent: 'flex-end' }}>
              <CellLayout label={t('Available')}>
                <LpAmount {...props.availableLp} userDataReady={userDataReady} />
              </CellLayout>
            </CellInner>
          </td>
          <td width="18%">
            <CellInner style={{ justifyContent: 'flex-end' }}>
              <CellLayout label={t('Staked')}>
                <LpAmount {...props.stakedLp} userDataReady={userDataReady} />
              </CellLayout>
            </CellInner>
          </td>
          <td width="2%">
            <CellInner style={{ justifyContent: 'flex-end' }}>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellInner>
          </td>
        </StyledTr>
      </>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={9}>
            <ActionPanel {...props} expanded={actionPanelExpanded} alignLinksToRight={isMobile} />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
