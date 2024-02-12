import { Gauge } from '@pancakeswap/gauges'
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  Button,
  Card,
  FlexGap,
  Grid,
  Link,
  Message,
  Skeleton,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Hex } from 'viem'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useEpochOnTally } from 'views/GaugesVoting/hooks/useEpochTime'
import { useEpochVotePower } from 'views/GaugesVoting/hooks/useEpochVotePower'
import { useUserVoteSlopes } from 'views/GaugesVoting/hooks/useUserVoteGauges'
import { useWriteGaugesVoteCallback } from 'views/GaugesVoting/hooks/useWriteGaugesVoteCallback'
import { useAccount } from 'wagmi'
import { RemainingVotePower } from '../../RemainingVotePower'
import { AddGaugeModal } from '../AddGauge/AddGaugeModal'
import { EmptyTable } from './EmptyTable'
import { VoteListItem } from './List'
import { TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'
import { useGaugeRows } from './hooks/useGaugeRows'
import { UserVote } from './types'

type GaugeWithDelta = Gauge & {
  delta: bigint
}

const Scrollable = styled.div.withConfig({ shouldForwardProp: (prop) => !['expanded'].includes(prop) })<{
  expanded: boolean
}>`
  overflow-y: auto;

  ${({ expanded }) => (!expanded ? 'max-height: 200px;' : '')}
`

export const VoteTable = () => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  // const { cakeUnlockTime, cakeLockedAmount } = useCakeLockStatus()
  const { cakeLockedAmount } = useCakeLockStatus()
  const cakeLocked = useMemo(() => cakeLockedAmount > 0n, [cakeLockedAmount])
  const gaugesCount = useGaugesVotingCount()
  const [isOpen, setIsOpen] = useState(false)
  const epochPower = useEpochVotePower()
  const onTally = useEpochOnTally()
  const [expanded, setExpanded] = useState(false)
  const [votes, setVotes] = useState<Record<Hex, UserVote>>({})
  const voteSum = useMemo(() => {
    return Object.values(votes).reduce((acc, cur) => acc + Number(cur?.power), 0)
  }, [votes])
  const lockedPowerPercent = useMemo(() => {
    return Object.values(votes).reduce((acc, cur) => acc + (cur?.locked ? Number(cur?.power) : 0), 0)
  }, [votes])

  const { gauges, rows, onRowSelect, refetch, isLoading } = useGaugeRows()
  const { data: slopes } = useUserVoteSlopes()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const rowsWithLock = useMemo(() => {
    return rows?.map((row) => {
      return {
        ...row,
        locked: votes[row.hash]?.locked,
      }
    })
  }, [votes, rows])

  const showNoCakeLockedWarning = useMemo(() => {
    return !cakeLocked && rowsWithLock?.length
  }, [cakeLocked, rowsWithLock])

  const showOnTallyWarning = useMemo(() => {
    return onTally && rowsWithLock?.length && cakeLocked
  }, [cakeLocked, onTally, rowsWithLock?.length])

  const onVoteChange = (value: UserVote, isMax?: boolean) => {
    const { hash, power } = value

    if (!hash || hash === '0x') return

    const newVotes = { ...votes }
    if (!rows?.find((r) => r.hash === hash)) return
    if (!newVotes[hash]) {
      newVotes[hash] = value
    }
    const sum = voteSum - Number(power || 0)
    if (isMax) {
      // @note: if epoch power is 0, the vote action will not works to the final result
      // open it just for better UX understanding vote power is linear changed
      // newVotes[index].power = 100 - sum > 0 && epochPower > 0n ? String(100 - sum) : '0'
      newVotes[hash].power = 100 - sum > 0 ? String(Number((100 - sum).toFixed(2))) : '0'
    } else {
      newVotes[hash] = value
    }
    setVotes(newVotes)
  }

  const { writeVote, isPending } = useWriteGaugesVoteCallback()

  const disabled = useMemo(() => {
    let lockedSum = Object.values(votes).reduce((acc, cur) => acc + (cur?.locked ? Number(cur?.power) : 0), 0)
    let newAddSum = Object.values(votes).reduce((acc, cur) => acc + (!cur?.locked ? Number(cur?.power) : 0), 0)
    lockedSum = Number(Number(lockedSum).toFixed(2))
    newAddSum = Number(Number(newAddSum).toFixed(2))

    // voting ended
    if (onTally) return true
    // no epoch power
    if (epochPower === 0n) return true
    // no new votes
    if (newAddSum === 0) return true
    // voted reached 100% or submitting
    if (lockedSum >= 100 || isPending) return true
    // should allow summed votes to be 100%, if new vote added
    if (newAddSum + lockedSum > 100) return true
    return false
  }, [epochPower, isPending, onTally, votes])
  const leftGaugesCanAdd = useMemo(() => {
    return Number(gaugesCount) - (rows?.length || 0)
  }, [gaugesCount, rows])

  const sortedSubmitVotes = useMemo(() => {
    const voteGauges = slopes
      .map((slope) => {
        const vote = votes[slope.hash]
        // update vote power
        if (vote && !vote?.locked) {
          const row = gauges?.find((r) => r.hash === slope.hash)
          if (!row) return undefined
          const currentPower = BigInt((Number(vote.power) * 100).toFixed(0))
          const { nativePower = 0, proxyPower = 0 } = slope || {}
          return {
            ...row,
            delta: currentPower - (BigInt(nativePower) + BigInt(proxyPower)),
            weight: currentPower,
          }
        }
        // vote deleted
        if (!vote && (slope.proxyPower > 0 || slope.nativePower > 0)) {
          const row = gauges?.find((r) => r.hash === slope.hash)
          if (!row) return undefined
          return {
            ...row,
            delta: 0n - (BigInt(slope.nativePower) + BigInt(slope.proxyPower)),
            weight: 0n,
          }
        }
        return undefined
      })
      .filter((gauge: GaugeWithDelta | undefined): gauge is GaugeWithDelta => Boolean(gauge))
      .sort((a, b) => (b.delta < a.delta ? 1 : -1))
    return voteGauges
  }, [slopes, votes, gauges])

  const submitVote = useCallback(async () => {
    await writeVote(sortedSubmitVotes)
    await refetch()
  }, [refetch, sortedSubmitVotes, writeVote])

  const gaugesTable = isDesktop ? (
    <>
      <TableHeader count={rows?.length} />

      {isLoading ? (
        <AutoColumn gap="16px" py="16px">
          <Skeleton height={64} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </AutoColumn>
      ) : null}

      {!isLoading ? (
        rows?.length ? (
          <div>
            <Scrollable expanded={expanded}>
              {rows.map((row) => (
                <TableRow
                  key={row.hash}
                  data={row}
                  vote={votes[row.hash]}
                  onChange={(v, isMax) => onVoteChange(v, isMax)}
                />
              ))}
            </Scrollable>
            {rows?.length > 3 ? <ExpandRow text={t('Show all')} onCollapse={() => setExpanded(!expanded)} /> : null}
          </div>
        ) : (
          <EmptyTable />
        )
      ) : null}
    </>
  ) : (
    <>
      {isLoading ? (
        <AutoColumn gap="16px" py="16px">
          <Skeleton height={134} />
          <Skeleton height={134} />
          <Skeleton height={34} />
        </AutoColumn>
      ) : null}
      {!isLoading ? (
        rows?.length ? (
          rows.map((row) => (
            <VoteListItem
              key={row.hash}
              data={row}
              vote={votes[row.hash]}
              onChange={(v, isMax) => onVoteChange(v, isMax)}
            />
          ))
        ) : (
          <EmptyTable />
        )
      ) : null}
    </>
  )

  // user unselect row
  useEffect(() => {
    if (rows && rows?.length < Object.values(votes).length) {
      const newVotes = { ...votes }
      Object.values(votes).forEach((v) => {
        if (!rows?.find((r) => r.hash === v.hash)) {
          delete newVotes[v.hash]
        }
      })
      setVotes(newVotes)
    }
  }, [rows, rows?.length, votes])

  return (
    <>
      <RemainingVotePower votedPercent={lockedPowerPercent} />
      <AddGaugeModal
        selectRows={rowsWithLock}
        onGaugeAdd={onRowSelect}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      />
      <ResponsiveCard>
        {gaugesTable}

        {rowsWithLock?.length && epochPower <= 0n && cakeLockedAmount > 0n ? (
          <Box width={['100%', '100%', '100%', '50%']} px={['16px', 'auto']} my={['24px', '24px', '36px']} mx="auto">
            <Message variant="warning" showIcon>
              <AutoColumn gap="8px">
                <Text>
                  {t(
                    'Your positions are unlocking soon. Therefore, you have no veCAKE balance at the end of the current voting epoch while votes are being tallied. ',
                  )}
                </Text>
                <FlexGap alignItems="center" gap="0.2em">
                  {t('To cast your vote, ')}
                  <Link href="/cake-staking" color="text">
                    <Text bold style={{ textDecoration: 'underline' }}>
                      {t('extend your lock >>')}
                    </Text>
                  </Link>
                </FlexGap>
              </AutoColumn>
            </Message>
          </Box>
        ) : null}
        {showNoCakeLockedWarning ? (
          <Box width={['100%', '100%', '100%', '50%']} px={['16px', 'auto']} my={['24px', '24px', '36px']} mx="auto">
            <Message variant="warning" showIcon>
              <AutoColumn gap="8px">
                <Text>{t('You have no locked CAKE.')}</Text>
                <FlexGap alignItems="center" gap="0.2em" flexWrap="wrap">
                  {t('To cast your vote, ')}
                  <Link href="/cake-staking" color="text">
                    <Text bold style={{ textDecoration: 'underline' }}>
                      {t('lock your CAKE')}
                    </Text>
                  </Link>
                  {t('for 3 weeks or more.')}
                </FlexGap>
              </AutoColumn>
            </Message>
          </Box>
        ) : null}
        {showOnTallyWarning ? (
          <Box width={['100%', '100%', '100%', '50%']} px={['16px', 'auto']} my={['24px', '24px', '36px']} mx="auto">
            <Message variant="warning" showIcon>
              <AutoColumn gap="8px">
                <Text>{t('Votes are currently being adjusted and tallied. No more votes can be casted.')}</Text>
              </AutoColumn>
            </Message>
          </Box>
        ) : null}
        <Grid
          gridTemplateColumns={!account ? '1fr' : '1fr 1fr'}
          gridGap="12px"
          padding={isDesktop ? '' : '1em'}
          style={{ marginTop: rows && rows?.length > 3 ? 0 : '8px' }}
        >
          {!account ? (
            <ConnectWalletButton mx="auto" width={isDesktop ? '50%' : '100%'} />
          ) : (
            <>
              <Button
                width="100%"
                onClick={() => setIsOpen(true)}
                style={{ whiteSpace: 'nowrap', padding: isMobile ? 0 : '0 16px' }}
              >
                + {t('Add Gauges')} {isMobile ? null : `(${leftGaugesCanAdd || 0})`}
              </Button>
              <Button
                width="100%"
                disabled={disabled}
                onClick={submitVote}
                style={{ whiteSpace: 'nowrap', padding: isMobile ? 0 : '0 16px' }}
              >
                {t('Submit vote')}
              </Button>
            </>
          )}
        </Grid>
      </ResponsiveCard>
    </>
  )
}

const ResponsiveCard: React.FC<PropsWithChildren> = ({ children }) => {
  const { isMobile, isDesktop } = useMatchBreakpoints()

  if (isMobile) {
    return <Box mx="-16px">{children}</Box>
  }

  return (
    <Card innerCardProps={{ padding: isDesktop ? '2em' : '0', paddingTop: isDesktop ? '1em' : '0' }} mt="2em">
      {children}
    </Card>
  )
}
