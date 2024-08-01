import styled from 'styled-components'
import { useCallback, useMemo, useState } from 'react'
import assign from 'lodash/assign'
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
} from 'state/farmsV4/hooks'
import { INetworkProps, ITokenProps, toTokenValue, toTokenValueByCurrency } from '@pancakeswap/widgets-internal'
import { Protocol } from '@pancakeswap/farms'

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

const StyledButtonMenu = styled(ButtonMenu) <{ $positionStatus: number }>`
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

enum V3_STATUS {
  ALL,
  ACTIVE,
  INACTIVE,
  CLOSED,
}
const getPoolStatus = (pos: PositionDetail, pool: Pool | null) => {
  if (pos.liquidity === 0n) {
    return V3_STATUS.CLOSED
  }
  if (pool && (pool.tickCurrent < pos.tickLower || pool.tickCurrent >= pos.tickUpper)) {
    return V3_STATUS.INACTIVE
  }
  return V3_STATUS.ACTIVE
}

const useV3Positions = ({
  selectedNetwork,
  selectedTokens,
  positionStatus,
}: {
  selectedNetwork: INetworkProps['value']
  selectedTokens: ITokenProps['value']
  positionStatus: V3_STATUS
}) => {
  const { address: account } = useAccount()
  const { data: v3Positions, pending: v3Loading } = useAccountV3Positions(allChainIds, account)
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
  const v3PositionsWithStatus = useMemo(
    () =>
      v3Positions.map((pos, idx) =>
        assign(pos, {
          status: getPoolStatus(pos, pools[idx][1]),
        }),
      ),
    [v3Positions, pools],
  )

  // const { poolsMap: v3Pools } = usePoolsByV3Positions(v3Positions)

  const v3Pools = useMemo(() => ({}), [])
  const filteredV3Positions = useMemo(
    () =>
      v3PositionsWithStatus.filter(
        (pos) =>
          selectedNetwork.includes(pos.chainId) &&
          (!selectedTokens?.length ||
            selectedTokens.some(
              (token) =>
                token === toTokenValue({ chainId: pos.chainId, address: pos.token0 }) ||
                token === toTokenValue({ chainId: pos.chainId, address: pos.token1 }),
            )) &&
          (positionStatus === V3_STATUS.ALL || pos.status === positionStatus),
      ),
    [selectedNetwork, selectedTokens, v3PositionsWithStatus, positionStatus],
  )

  const sortedV3Positions = useMemo(
    () => filteredV3Positions.sort((a, b) => a.status - b.status),
    [filteredV3Positions],
  )

  const v3PositionList = useMemo(
    () =>
      sortedV3Positions.map((pos) => {
        const key = getKeyForPools(pos.chainId, pos.tokenId.toString())
        return <PositionV3Item key={key} data={pos} pool={v3Pools[key]} />
      }),
    [sortedV3Positions, v3Pools],
  )

  return {
    v3Loading,
    v3PositionList,
  }
}

const useV2Positions = ({
  selectedNetwork,
  selectedTokens,
  positionStatus,
}: {
  selectedNetwork: INetworkProps['value']
  selectedTokens: ITokenProps['value']
  positionStatus: V3_STATUS
}) => {
  const { address: account } = useAccount()
  const { data: v2Positions, pending: v2Loading } = useAccountV2LpDetails(allChainIds, account)
  const { poolsMap: v2Pools } = usePoolsByV2Positions(v2Positions)
  const filteredV2Positions = useMemo(
    () =>
      v2Positions.filter(
        (pos) =>
          selectedNetwork.includes(pos.pair.chainId) &&
          (!selectedTokens?.length ||
            selectedTokens.some(
              (token) => token === toTokenValue(pos.pair.token0) || token === toTokenValue(pos.pair.token1),
            )) &&
          positionStatus === 0,
      ),
    [selectedNetwork, selectedTokens, v2Positions, positionStatus],
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
  return {
    v2Loading,
    v2PositionList,
  }
}

const useStablePositions = ({
  selectedNetwork,
  selectedTokens,
  positionStatus,
}: {
  selectedNetwork: INetworkProps['value']
  selectedTokens: ITokenProps['value']
  positionStatus: V3_STATUS
}) => {
  const { address: account } = useAccount()
  const { data: stablePositions, pending: stableLoading } = useAccountStableLpDetails(allChainIds, account)
  const { poolsMap: stablePools } = usePoolsByStablePositions(stablePositions)

  const filteredStablePositions = useMemo(
    () =>
      stablePositions.filter(
        (pos) =>
          selectedNetwork.includes(pos.pair.liquidityToken.chainId) &&
          (!selectedTokens?.length ||
            selectedTokens.some(
              (token) =>
                token === toTokenValueByCurrency(pos.pair.token0) || token === toTokenValueByCurrency(pos.pair.token1),
            )) &&
          positionStatus === 0,
      ),
    [selectedNetwork, selectedTokens, stablePositions, positionStatus],
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
  return {
    stableLoading,
    stablePositionList,
  }
}

const allChainIds = MAINNET_CHAINS.map((chain) => chain.id)

export const PositionPage = () => {
  const { t } = useTranslation()
  const [expertMode] = useExpertMode()

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

  const { v3PositionList, v3Loading } = useV3Positions({
    selectedNetwork: filters.selectedNetwork,
    selectedTokens: filters.selectedTokens,
    positionStatus,
  })
  const { v2PositionList, v2Loading } = useV2Positions({
    selectedNetwork: filters.selectedNetwork,
    selectedTokens: filters.selectedTokens,
    positionStatus,
  })
  const { stablePositionList, stableLoading } = useStablePositions({
    selectedNetwork: filters.selectedNetwork,
    selectedTokens: filters.selectedTokens,
    positionStatus,
  })

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
    // Do protocol filter here.
    // Avoid to recalculate all the positions data
    const sectionMap = {
      [Protocol.V3]: v3PositionList,
      [Protocol.V2]: v2PositionList,
      [Protocol.STABLE]: stablePositionList,
    }
    return selectedPoolTypes.map((type) => sectionMap[type])
  }, [t, v2Loading, v3Loading, stableLoading, v3PositionList, stablePositionList, v2PositionList, selectedPoolTypes])

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
