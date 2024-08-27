import styled from 'styled-components'
import { useCallback, useMemo, useState } from 'react'
import {
  ButtonMenu,
  ButtonMenuItem,
  Dots,
  Flex,
  HistoryIcon,
  IconButton,
  NotificationDot,
  Text,
  Toggle,
  useModal,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { useExpertMode } from '@pancakeswap/utils/user'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import { useAccount } from 'wagmi'
import {
  getKeyForPools,
  useAccountStableLpDetails,
  useAccountV2LpDetails,
  useAccountV3Positions,
  usePoolsByStablePositions,
  usePoolsByV2Positions,
  usePoolsByV3Positions,
} from 'state/farmsV4/hooks'
import { toTokenValue, toTokenValueByCurrency } from '@pancakeswap/widgets-internal'

import { usePoolsWithChainId } from 'hooks/v3/usePools'
import getTokenByAddress from 'state/farmsV4/state/utils'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { Pool } from '@pancakeswap/v3-sdk'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import {
  Card,
  CardBody as StyledCardBody,
  CardHeader as StyledCardHeader,
  IPoolsFilterPanelProps,
  MAINNET_CHAINS,
  PoolsFilterPanel,
  useSelectedPoolTypes,
  PositionV3Item,
  PositionV2Item,
  PositionStableItem,
} from './components'

const ToggleWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`
const ButtonWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`

const CardBody = styled(StyledCardBody)`
  padding: 24px;
  gap: 8px;
  background: ${({ theme }) => theme.colors.dropdown};
  border-bottom-left-radius: ${({ theme }) => theme.radii.card};
  border-bottom-right-radius: ${({ theme }) => theme.radii.card};
`

const CardHeader = styled(StyledCardHeader)`
  padding-bottom: 0;
`

const StyledButtonMenu = styled(ButtonMenu)<{ $positionStatus: number }>`
  & button[variant='text']:nth-child(${({ $positionStatus }) => $positionStatus + 1}) {
    color: ${({ theme }) => theme.colors.secondary};
  }
`

const SubPanel = styled(Flex)`
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  row-gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  margin: 24px -24px 0;
`

export const PositionPage = () => {
  const { t } = useTranslation()
  const [expertMode] = useExpertMode()

  const allChainIds = useMemo(() => MAINNET_CHAINS.map((chain) => chain.id), [])
  const [filters, setFilters] = useState<IPoolsFilterPanelProps['value']>({
    selectedTypeIndex: 0,
    selectedNetwork: allChainIds,
    selectedTokens: [],
  })
  const selectedPoolTypes = useSelectedPoolTypes(filters.selectedTypeIndex)
  const [farmsOnly, setFarmsOnly] = useState(false)
  const [positionStatus, setPositionStatus] = useState(0)
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

  const toggleFarmsOnly = useCallback(() => {
    setFarmsOnly(!farmsOnly)
  }, [farmsOnly])

  const handleFilterChange: IPoolsFilterPanelProps['onChange'] = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }))
  }, [])

  const { address: account } = useAccount()
  const { data: v3Positions, pending: v3Loading } = useAccountV3Positions(filters.selectedNetwork, account)
  const v3PoolKeys = useMemo(
    () =>
      v3Positions.map(
        (pos) =>
          [getTokenByAddress(pos.chainId, pos.token0), getTokenByAddress(pos.chainId, pos.token1), pos.fee] as [
            Currency,
            Currency,
            number,
          ],
      ),
    [v3Positions],
  )
  const pools = usePoolsWithChainId(v3PoolKeys)

  const { poolsMap: v3Pools } = usePoolsByV3Positions(v3Positions)
  const { data: v2Positions, pending: v2Loading } = useAccountV2LpDetails(filters.selectedNetwork, account)
  const { poolsMap: v2Pools } = usePoolsByV2Positions(v2Positions)
  const { data: stablePositions, pending: stableLoading } = useAccountStableLpDetails(filters.selectedNetwork, account)
  const { poolsMap: stablePools } = usePoolsByStablePositions(stablePositions)

  const checkStatus = useCallback(
    (pos: PositionDetail, pool: Pool | null) => {
      switch (positionStatus) {
        // all
        case 0:
          return true
        // active
        case 1:
          return pool && pool.tickCurrent >= pos.tickLower && pool.tickCurrent < pos.tickUpper && pos.liquidity !== 0n
        // inactive
        case 2:
          return pool && (pool.tickCurrent < pos.tickLower || pool.tickCurrent >= pos.tickUpper) && pos.liquidity !== 0n
        // closed
        case 3:
          return pos.liquidity === 0n
        default:
          return true
      }
    },
    [positionStatus],
  )

  const filteredV3Positions = useMemo(
    () =>
      v3Positions.filter(
        (pos, idx) =>
          filters.selectedNetwork.includes(pos.chainId) &&
          selectedPoolTypes.includes(pos.protocol) &&
          (!filters.selectedTokens?.length ||
            filters.selectedTokens.some(
              (token) =>
                token === toTokenValue({ chainId: pos.chainId, address: pos.token0 }) ||
                token === toTokenValue({ chainId: pos.chainId, address: pos.token1 }),
            )) &&
          checkStatus(pos, pools[idx][1]),
      ),
    [filters.selectedNetwork, filters.selectedTokens, selectedPoolTypes, v3Positions, checkStatus, pools],
  )

  const filteredV2Positions = useMemo(
    () =>
      v2Positions.filter(
        (pos) =>
          filters.selectedNetwork.includes(pos.pair.chainId) &&
          selectedPoolTypes.includes(pos.protocol) &&
          (!filters.selectedTokens?.length ||
            filters.selectedTokens.some(
              (token) => token === toTokenValue(pos.pair.token0) || token === toTokenValue(pos.pair.token1),
            )) &&
          positionStatus === 0,
      ),
    [filters.selectedNetwork, filters.selectedTokens, selectedPoolTypes, v2Positions, positionStatus],
  )

  const filteredStablePositions = useMemo(
    () =>
      stablePositions.filter(
        (pos) =>
          filters.selectedNetwork.includes(pos.pair.liquidityToken.chainId) &&
          selectedPoolTypes.includes(pos.protocol) &&
          (!filters.selectedTokens?.length ||
            filters.selectedTokens.some(
              (token) =>
                token === toTokenValueByCurrency(pos.pair.token0) || token === toTokenValueByCurrency(pos.pair.token1),
            )) &&
          positionStatus === 0,
      ),
    [filters.selectedNetwork, filters.selectedTokens, selectedPoolTypes, stablePositions, positionStatus],
  )

  const v3PositionList = useMemo(
    () =>
      filteredV3Positions.map((pos) => {
        const key = getKeyForPools(pos.chainId, pos.tokenId.toString())
        return <PositionV3Item key={key} data={pos} pool={v3Pools[key]} />
      }),
    [filteredV3Positions, v3Pools],
  )

  const v2PositionList = useMemo(
    () =>
      filteredV2Positions.map((pos) => {
        const {
          chainId,
          liquidityToken: { address },
        } = pos.pair
        const key = getKeyForPools(chainId, address)
        return <PositionV2Item key={key} data={pos} pool={v2Pools[key]} />
      }),
    [filteredV2Positions, v2Pools],
  )

  const stablePositionList = useMemo(
    () =>
      filteredStablePositions.map((pos) => {
        const {
          liquidityToken: { chainId, address },
        } = pos.pair
        const key = getKeyForPools(chainId, address)
        return <PositionStableItem key={key} data={pos} pool={stablePools[key]} />
      }),
    [filteredStablePositions, stablePools],
  )

  const mainSection = useMemo(() => {
    if (v3Loading && v2Loading && stableLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    if (!v3PositionList.length && !v2PositionList.length && !stablePositionList.length) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('No liquidity found.')}
        </Text>
      )
    }
    return [v3PositionList, stablePositionList, v2PositionList]
  }, [t, v2Loading, v3Loading, stableLoading, v3PositionList, stablePositionList, v2PositionList])

  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel onChange={handleFilterChange} value={filters}>
          <ControlWrapper>
            <ToggleWrapper>
              <Text>{t('Farms only')}</Text>
              <Toggle checked={farmsOnly} onChange={toggleFarmsOnly} scale="sm" />
            </ToggleWrapper>
            <ButtonWrapper>
              <IconButton onClick={onPresentTransactionsModal} variant="text" scale="xs">
                <HistoryIcon color="textSubtle" width="24px" />
              </IconButton>
              <NotificationDot show={expertMode}>
                <GlobalSettings mode={SettingsMode.SWAP_LIQUIDITY} scale="xs" />
              </NotificationDot>
            </ButtonWrapper>
          </ControlWrapper>
        </PoolsFilterPanel>
        <SubPanel>
          <StyledButtonMenu
            $positionStatus={positionStatus}
            activeIndex={positionStatus}
            onItemClick={setPositionStatus}
            variant="text"
          >
            <ButtonMenuItem>{t('All')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Active')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Inactive')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Closed')}</ButtonMenuItem>
          </StyledButtonMenu>
        </SubPanel>
      </CardHeader>
      <CardBody>{mainSection}</CardBody>
    </Card>
  )
}
