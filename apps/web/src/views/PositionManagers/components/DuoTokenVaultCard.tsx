import { MANAGER, ManagerFee, Strategy } from '@pancakeswap/position-managers'
import { Card, CardBody } from '@pancakeswap/uikit'
import { Currency, Percent, Price, CurrencyAmount } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Address } from 'viem'
import { ReactNode, memo, PropsWithChildren, useMemo } from 'react'
import { styled } from 'styled-components'
import { useApr } from 'views/PositionManagers/hooks/useApr'
import { CardTitle } from './CardTitle'
import { YieldInfo } from './YieldInfo'
import { ManagerInfo } from './ManagerInfo'
import { LiquidityManagement } from './LiquidityManagement'
import { getVaultName } from '../utils'
import { ExpandableSection } from './ExpandableSection'
import { VaultInfo } from './VaultInfo'
import { VaultLinks } from './VaultLinks'
import { AprDataInfo } from '../hooks'

const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`

interface Props {
  currencyA: Currency
  currencyB: Currency
  earningToken: Currency
  name: string
  id: string | number
  feeTier: FeeAmount
  ratio: number
  strategy: Strategy
  manager: {
    id: MANAGER
    name: string
  }
  managerFee: ManagerFee
  autoFarm?: boolean
  autoCompound?: boolean
  info?: ReactNode
  isSingleDepositToken: boolean
  allowDepositToken0?: boolean
  allowDepositToken1?: boolean
  contractAddress: Address
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  stakedToken0Amount?: bigint
  stakedToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
  pendingReward: bigint | undefined
  userVaultPercentage?: Percent
  vaultAddress: Address
  managerInfoUrl: string
  strategyInfoUrl: string
  projectVaultUrl?: string
  rewardPerSecond: string
  aprDataInfo: {
    info: AprDataInfo | undefined
    isLoading: boolean
  }
  rewardEndTime: number
  rewardStartTime: number
  refetch?: () => void
  totalAssetsInUsd: number
}

export const DuoTokenVaultCard = memo(function DuoTokenVaultCard({
  currencyA,
  currencyB,
  earningToken,
  name,
  id,
  feeTier,
  autoFarm,
  autoCompound,
  manager,
  managerFee,
  strategy,
  ratio,
  isSingleDepositToken,
  allowDepositToken0 = true,
  allowDepositToken1 = true,
  contractAddress,
  stakedToken0Amount,
  stakedToken1Amount,
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
  pendingReward,
  userVaultPercentage,
  vaultAddress,
  managerInfoUrl,
  strategyInfoUrl,
  projectVaultUrl,
  rewardPerSecond,
  aprDataInfo,
  rewardEndTime,
  refetch,
  rewardStartTime,
  totalAssetsInUsd,
}: PropsWithChildren<Props>) {
  const apr = useApr({
    currencyA,
    currencyB,
    poolToken0Amount,
    poolToken1Amount,
    token0PriceUSD,
    token1PriceUSD,
    rewardPerSecond,
    earningToken,
    avgToken0Amount: aprDataInfo?.info?.token0 ?? 0,
    avgToken1Amount: aprDataInfo?.info?.token1 ?? 0,
    rewardEndTime,
    rewardStartTime,
  })

  const price = new Price(currencyA, currencyB, 100000n, 100000n)
  const vaultName = useMemo(() => getVaultName(id, name), [name, id])
  const staked0Amount = stakedToken0Amount ? CurrencyAmount.fromRawAmount(currencyA, stakedToken0Amount) : undefined
  const staked1Amount = stakedToken1Amount ? CurrencyAmount.fromRawAmount(currencyB, stakedToken1Amount) : undefined

  const withCakeReward: boolean = useMemo(() => earningToken.symbol === 'CAKE', [earningToken])

  return (
    <StyledCard>
      <CardTitle
        currencyA={currencyA}
        currencyB={currencyB}
        vaultName={vaultName}
        feeTier={feeTier}
        autoFarm={autoFarm}
        autoCompound={autoCompound}
        isSingleDepositToken={isSingleDepositToken}
      />
      <CardBody>
        <YieldInfo
          id={id}
          apr={apr}
          isAprLoading={aprDataInfo.isLoading}
          autoCompound={autoCompound}
          withCakeReward={withCakeReward}
          totalAssetsInUsd={totalAssetsInUsd}
        />
        <ManagerInfo mt="1.5em" id={manager.id} name={manager.name} strategy={strategy} />
        <LiquidityManagement
          manager={manager}
          currencyA={currencyA}
          currencyB={currencyB}
          earningToken={earningToken}
          price={price}
          vaultName={vaultName}
          feeTier={feeTier}
          ratio={ratio}
          isSingleDepositToken={isSingleDepositToken}
          allowDepositToken0={allowDepositToken0}
          allowDepositToken1={allowDepositToken1}
          contractAddress={contractAddress}
          staked0Amount={staked0Amount}
          staked1Amount={staked1Amount}
          token0PriceUSD={token0PriceUSD}
          token1PriceUSD={token1PriceUSD}
          pendingReward={pendingReward}
          userVaultPercentage={userVaultPercentage}
          poolToken0Amount={poolToken0Amount}
          poolToken1Amount={poolToken1Amount}
          rewardPerSecond={rewardPerSecond}
          aprDataInfo={aprDataInfo}
          rewardEndTime={rewardEndTime}
          refetch={refetch}
          rewardStartTime={rewardStartTime}
        />
        <ExpandableSection mt="1.5em">
          <VaultInfo
            currencyA={currencyA}
            currencyB={currencyB}
            managerFee={managerFee}
            token0PriceUSD={token0PriceUSD}
            token1PriceUSD={token1PriceUSD}
            poolToken0Amount={poolToken0Amount}
            poolToken1Amount={poolToken1Amount}
            allowDepositToken0={allowDepositToken0}
            allowDepositToken1={allowDepositToken1}
            isSingleDepositToken={isSingleDepositToken}
          />
          <VaultLinks
            mt="0.5em"
            manager={manager}
            vaultAddress={vaultAddress}
            managerAddress={contractAddress}
            managerInfoUrl={managerInfoUrl}
            strategyInfoUrl={strategyInfoUrl}
            projectVaultUrl={projectVaultUrl}
          />
        </ExpandableSection>
      </CardBody>
    </StyledCard>
  )
})
