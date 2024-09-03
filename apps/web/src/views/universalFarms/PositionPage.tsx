import { Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import {
  AddIcon,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Dots,
  Flex,
  FlexGap,
  HistoryIcon,
  IconButton,
  NotificationDot,
  Text,
  Toggle,
  useModal,
} from '@pancakeswap/uikit'
import { useExpertMode } from '@pancakeswap/utils/user'
import {
  INetworkProps,
  ITokenProps,
  Liquidity,
  toTokenValue,
  toTokenValueByCurrency,
} from '@pancakeswap/widgets-internal'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { ASSET_CDN } from 'config/constants/endpoints'
import assign from 'lodash/assign'
import intersection from 'lodash/intersection'
import NextLink from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getKeyForPools,
  useAccountStableLpDetails,
  useAccountV2LpDetails,
  useAccountV3Positions,
  useV2PoolsLength,
  useV3PoolsLength,
} from 'state/farmsV4/hooks'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { Currency } from '@pancakeswap/swap-sdk-core'
import { getTokenByAddress } from '@pancakeswap/tokens'
import { Pool } from '@pancakeswap/v3-sdk'
import { usePoolsWithMultiChains } from 'hooks/v3/usePools'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import { V3_MIGRATION_SUPPORTED_CHAINS } from 'config/constants/supportChains'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import {
  Card,
  IPoolsFilterPanelProps,
  PoolsFilterPanel,
  StablePositionItem,
  CardBody as StyledCardBody,
  CardHeader as StyledCardHeader,
  useSelectedPoolTypes,
  V2PositionItem,
  V3PositionItem,
  PositionItemSkeleton,
} from './components'
import { MAINNET_CHAINS } from './hooks/useMultiChains'
import { V3_STATUS, useFilterToQueries } from './hooks/useFilterToQueries'

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
  & button {
    padding: 0 12px;
  }
  & button[variant='text']:nth-child(${({ $positionStatus }) => $positionStatus + 1}) {
    color: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: 967px) {
    width: 100%;
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

const ButtonContainer = styled.div`
  @media (max-width: 967px) {
    width: 100%;

    button {
      width: 50%;
      height: 50px;
    }
  }
`

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
  farmsOnly,
}: {
  selectedNetwork: INetworkProps['value']
  selectedTokens: ITokenProps['value']
  positionStatus: V3_STATUS
  farmsOnly: boolean
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
  const pools = usePoolsWithMultiChains(v3PoolKeys)
  const v3PositionsWithStatus = useMemo(
    () =>
      v3Positions.map((pos, idx) =>
        assign(pos, {
          status: getPoolStatus(pos, pools[idx][1]),
        }),
      ),
    [v3Positions, pools],
  )

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
          (positionStatus === V3_STATUS.ALL || pos.status === positionStatus) &&
          (!farmsOnly || pos.isStaked),
      ),
    [selectedNetwork, selectedTokens, v3PositionsWithStatus, positionStatus, farmsOnly],
  )

  const sortedV3Positions = useMemo(
    () => filteredV3Positions.sort((a, b) => a.status - b.status),
    [filteredV3Positions],
  )

  const { data: poolsLength } = useV3PoolsLength(allChainIds)

  const v3PositionList = useMemo(
    () =>
      sortedV3Positions.map((pos) => {
        const key = getKeyForPools(pos.chainId, pos.tokenId.toString())
        return <V3PositionItem key={key} data={pos} poolLength={poolsLength[pos.chainId]} />
      }),
    [sortedV3Positions, poolsLength],
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
  farmsOnly,
}: {
  selectedNetwork: INetworkProps['value']
  selectedTokens: ITokenProps['value']
  positionStatus: V3_STATUS
  farmsOnly: boolean
}) => {
  const { address: account } = useAccount()
  const { data: v2Positions, pending: v2Loading } = useAccountV2LpDetails(allChainIds, account)
  const filteredV2Positions = useMemo(
    () =>
      v2Positions.filter(
        (pos) =>
          selectedNetwork.includes(pos.pair.chainId) &&
          (!selectedTokens?.length ||
            selectedTokens.some(
              (token) => token === toTokenValue(pos.pair.token0) || token === toTokenValue(pos.pair.token1),
            )) &&
          [V3_STATUS.ALL, V3_STATUS.ACTIVE].includes(positionStatus) &&
          (!farmsOnly || pos.isStaked),
      ),
    [farmsOnly, selectedNetwork, selectedTokens, v2Positions, positionStatus],
  )
  const { data: poolsLength } = useV2PoolsLength(allChainIds)
  const v2PositionList = useMemo(
    () =>
      filteredV2Positions.map((pos) => {
        const {
          chainId,
          liquidityToken: { address },
        } = pos.pair
        const key = getKeyForPools(chainId, address)
        return <V2PositionItem key={key} data={pos} poolLength={poolsLength[chainId]} />
      }),
    [filteredV2Positions, poolsLength],
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
  farmsOnly,
}: {
  selectedNetwork: INetworkProps['value']
  selectedTokens: ITokenProps['value']
  positionStatus: V3_STATUS
  farmsOnly: boolean
}) => {
  const { address: account } = useAccount()
  const { data: stablePositions, pending: stableLoading } = useAccountStableLpDetails(allChainIds, account)

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
          [V3_STATUS.ALL, V3_STATUS.ACTIVE].includes(positionStatus) &&
          (!farmsOnly || pos.isStaked),
      ),
    [farmsOnly, selectedNetwork, selectedTokens, stablePositions, positionStatus],
  )

  const stablePositionList = useMemo(
    () =>
      filteredStablePositions.map((pos) => {
        const {
          liquidityToken: { chainId, address },
        } = pos.pair
        const key = getKeyForPools(chainId, address)
        return <StablePositionItem key={key} data={pos} />
      }),
    [filteredStablePositions],
  )
  return {
    stableLoading,
    stablePositionList,
  }
}

const EmptyListPlaceholder = ({ text, imageUrl }: { text: string; imageUrl?: string }) => (
  <FlexGap alignItems="center" flexDirection="column" gap="16px">
    <img
      width={156}
      height={179}
      alt="empty placeholder"
      src={imageUrl ?? `${ASSET_CDN}/web/universalFarms/empty_list_bunny.png`}
    />
    <Text fontSize="14px" color="textSubtle" textAlign="center">
      {text}
    </Text>
  </FlexGap>
)

const allChainIds = MAINNET_CHAINS.map((chain) => chain.id)
const NUMBER_OF_FARMS_VISIBLE = 10

export const PositionPage = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [expertMode] = useExpertMode()

  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [cursorVisible, setCursorVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const { replaceURLQueriesByFilter, ...filters } = useFilterToQueries()
  const { selectedTypeIndex, selectedNetwork, selectedTokens, positionStatus, farmsOnly } = filters

  const poolsFilter = useMemo(
    () => ({
      selectedTypeIndex,
      selectedNetwork,
      selectedTokens,
    }),
    [selectedTypeIndex, selectedNetwork, selectedTokens],
  )
  const selectedPoolTypes = useSelectedPoolTypes(selectedTypeIndex)
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

  const setPositionStatus = useCallback(
    (status: V3_STATUS) => {
      replaceURLQueriesByFilter({
        ...filters,
        positionStatus: status,
      })
    },
    [filters, replaceURLQueriesByFilter],
  )

  const toggleFarmsOnly = useCallback(() => {
    replaceURLQueriesByFilter({
      ...filters,
      farmsOnly: !farmsOnly,
    })
  }, [filters, farmsOnly, replaceURLQueriesByFilter])

  const handleFilterChange: IPoolsFilterPanelProps['onChange'] = useCallback(
    (newFilters) => {
      replaceURLQueriesByFilter({
        ...filters,
        ...newFilters,
      })
    },
    [filters, replaceURLQueriesByFilter],
  )

  const { v3PositionList, v3Loading } = useV3Positions({
    selectedNetwork,
    selectedTokens,
    positionStatus,
    farmsOnly,
  })
  const { v2PositionList, v2Loading } = useV2Positions({
    selectedNetwork,
    selectedTokens,
    positionStatus,
    farmsOnly,
  })
  const { stablePositionList, stableLoading } = useStablePositions({
    selectedNetwork,
    selectedTokens,
    positionStatus,
    farmsOnly,
  })

  const mainSection = useMemo(() => {
    if (!account) {
      return <EmptyListPlaceholder text={t('Please Connect Wallet to view positions.')} />
    }
    if (v3Loading && v2Loading && stableLoading) {
      return (
        <>
          <PositionItemSkeleton />
          <Text color="textSubtle" textAlign="center">
            <Dots>{t('Loading')}</Dots>
          </Text>
        </>
      )
    }

    if (!v3PositionList.length && !v2PositionList.length && !stablePositionList.length) {
      return (
        <EmptyListPlaceholder
          text={t('You have no %status% position in this wallet.', {
            status:
              positionStatus === V3_STATUS.ACTIVE
                ? 'active'
                : positionStatus === V3_STATUS.INACTIVE
                ? 'inactive'
                : positionStatus === V3_STATUS.CLOSED
                ? 'closed'
                : '',
          })}
        />
      )
    }
    // Do protocol filter here.
    // Avoid to recalculate all the positions data
    const sectionMap = {
      [Protocol.V3]: v3PositionList,
      [Protocol.V2]: v2PositionList,
      [Protocol.STABLE]: stablePositionList,
    }
    return selectedPoolTypes.reduce((acc, type) => acc.concat(sectionMap[type]), []).slice(0, cursorVisible)
  }, [
    account,
    t,
    v2Loading,
    v3Loading,
    stableLoading,
    v3PositionList,
    stablePositionList,
    v2PositionList,
    selectedPoolTypes,
    cursorVisible,
    positionStatus,
  ])

  useEffect(() => {
    if (isIntersecting) {
      setCursorVisible((numberCurrentlyVisible) => {
        if (Array.isArray(mainSection) && numberCurrentlyVisible <= mainSection.length) {
          return Math.min(
            numberCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE,
            v3PositionList.length + v2PositionList.length + stablePositionList.length,
          )
        }
        return numberCurrentlyVisible
      })
    }
  }, [isIntersecting, mainSection, v3PositionList.length, v2PositionList.length, stablePositionList.length])

  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel onChange={handleFilterChange} value={poolsFilter}>
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
            scale="sm"
          >
            <ButtonMenuItem>{t('All')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Active')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Inactive')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Closed')}</ButtonMenuItem>
          </StyledButtonMenu>
          <ButtonContainer>
            <NextLink href="/add">
              <Button endIcon={<AddIcon color="invertedContrast" />} scale="sm">
                {t('Add Liquidity')}
              </Button>
            </NextLink>
          </ButtonContainer>
        </SubPanel>
      </CardHeader>
      <CardBody>
        {mainSection}
        {selectedPoolTypes.length === 1 && selectedPoolTypes.includes(Protocol.V2) ? (
          <Liquidity.FindOtherLP>
            {!!intersection(V3_MIGRATION_SUPPORTED_CHAINS, selectedNetwork).length && (
              <NextLink style={{ marginTop: '8px' }} href="/migration">
                <Button id="migration-link" variant="secondary" scale="sm">
                  {t('Migrate to V3')}
                </Button>
              </NextLink>
            )}
          </Liquidity.FindOtherLP>
        ) : null}
        {Array.isArray(mainSection) && mainSection.length > 0 && <div ref={observerRef} />}
      </CardBody>
    </Card>
  )
}
