import { Gauge } from '@pancakeswap/gauges'
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  Button,
  Card,
  FlexGap,
  Link,
  Message,
  Skeleton,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Hex } from 'viem'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useEpochOnTally } from 'views/GaugesVoting/hooks/useEpochTime'
import { useEpochVotePower } from 'views/GaugesVoting/hooks/useEpochVotePower'
import { useWriteGaugesVoteCallback } from 'views/GaugesVoting/hooks/useWriteGaugesVoteCallback'
import { RemainingVotePower } from '../../RemainingVotePower'
import { AddGaugeModal } from '../AddGauge/AddGaugeModal'
import { EmptyTable } from './EmptyTable'
import { VoteListItem } from './List'
import { TableHeader } from './TableHeader'
import { ExpandRow, TableRow } from './TableRow'
import { useGaugeRows } from './hooks/useGaugeRows'
import { UserVote } from './types'

const Scrollable = styled.div.withConfig({ shouldForwardProp: (prop) => !['expanded'].includes(prop) })<{
  expanded: boolean
}>`
  overflow-y: auto;
  height: ${({ expanded }) => (expanded ? 'auto' : '210px')};
`

export const VoteTable = () => {
  const { account } = useActiveWeb3React()
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

  const { rows, onRowSelect, refetch, isLoading } = useGaugeRows()
  const { isDesktop } = useMatchBreakpoints()
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
    const lockedSum = Object.values(votes).reduce((acc, cur) => acc + (cur?.locked ? Number(cur?.power) : 0), 0)
    const newAddSum = Object.values(votes).reduce((acc, cur) => acc + (!cur?.locked ? Number(cur?.power) : 0), 0)

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

  const submitVote = useCallback(async () => {
    const voteGauges = Object.values(votes)
      .map((vote) => {
        if (!vote.locked && Number(vote.power)) {
          const row = rows?.find((r) => r.hash === vote.hash)
          if (!row) return undefined
          return {
            ...row,
            weight: BigInt((Number(vote.power) * 100).toFixed(0)),
          }
        }
        return undefined
      })
      .filter(Boolean) as Gauge[]

    await writeVote(voteGauges)
    await refetch()
  }, [refetch, rows, votes, writeVote])

  const gauges = isDesktop ? (
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
          <tbody>
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
          </tbody>
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
      <Card innerCardProps={{ padding: isDesktop ? '2em' : '0', paddingTop: isDesktop ? '1em' : '0' }} mt="2em">
        {gauges}

        {rowsWithLock?.length && epochPower <= 0n && cakeLockedAmount > 0n ? (
          <Box width={['100%', '100%', '100%', '50%']} px={['16px', 'auto']} mx="auto">
            <Message variant="warning" showIcon>
              <AutoColumn gap="8px">
                <Text>
                  {t(
                    'Your positions are unlocking soon. Therefore, you have no veCAKE balance at the end of the current voting epoch while votes are being tallied. ',
                  )}
                </Text>
                <FlexGap alignItems="center" gap="0.2em">
                  {t('To cast your vote, ')}
                  <Link href="/cake-staking">
                    <Text bold>{t('extend your lock >>')}</Text>
                  </Link>
                </FlexGap>
              </AutoColumn>
            </Message>
          </Box>
        ) : null}
        {showNoCakeLockedWarning ? (
          <Box width={['100%', '100%', '100%', '50%']} px={['16px', 'auto']} mx="auto">
            <Message variant="warning" showIcon>
              <AutoColumn gap="8px">
                <Text>{t('You have no locked CAKE.')}</Text>
                <FlexGap alignItems="center" gap="0.2em">
                  {t('To cast your vote, ')}
                  <Link href="/cake-staking">
                    <Text bold>{t('lock your CAKE')}</Text>
                  </Link>
                  {t('for 3 weeks or more.')}
                </FlexGap>
              </AutoColumn>
            </Message>
          </Box>
        ) : null}
        {showOnTallyWarning ? (
          <Box width={['100%', '100%', '100%', '50%']} px={['16px', 'auto']} mx="auto">
            <Message variant="warning" showIcon>
              <AutoColumn gap="8px">
                <Text>{t('Votes are currently being adjusted and tallied. No more votes can be casted.')}</Text>
              </AutoColumn>
            </Message>
          </Box>
        ) : null}
        <FlexGap
          gap="12px"
          padding={isDesktop ? '2em' : '1em'}
          style={{ marginTop: rows && rows?.length > 3 ? 0 : '8px' }}
        >
          <Button width="100%" onClick={() => setIsOpen(true)}>
            + Add Gauges ({leftGaugesCanAdd || 0})
          </Button>
          {!account ? (
            <ConnectWalletButton width="100%" />
          ) : (
            <Button width="100%" disabled={disabled} onClick={submitVote}>
              Submit vote
            </Button>
          )}
        </FlexGap>
      </Card>
    </>
  )
}
