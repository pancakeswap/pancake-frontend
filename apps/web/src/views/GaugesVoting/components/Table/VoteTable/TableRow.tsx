import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, ChevronUpIcon, ErrorIcon, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { GAUGE_TYPE_NAMES, GaugeType } from 'config/constants/types'
import { MAX_VECAKE_LOCK_WEEKS, WEEK } from 'config/constants/veCake'
import dayjs from 'dayjs'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useGaugeConfig } from 'views/GaugesVoting/hooks/useGaugePair'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { feeTierPercent } from 'views/V3Info/utils'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'
import { PercentInput } from './PercentInput'

export const TableRow: React.FC<{
  data: GaugeVoting
  value: string
  onChange: (value: string) => void
}> = ({ data, value, onChange }) => {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { balance: veCake } = useVeCakeBalance()

  const pool = useGaugeConfig(data?.pairAddress as Address, Number(data?.chainId || undefined))

  const userVote = useUserVote(data)
  const voteDisabled = userVote?.voteLocked
  const powerPercent = useMemo(() => {
    return userVote?.power ? new Percent(userVote?.power, 10000).toSignificant(2) : undefined
  }, [userVote?.power])
  const power = useMemo(() => {
    if (userVote?.slope && userVote?.power) {
      const amount = getBalanceNumber(
        new BN(userVote.slope).times(userVote.end - currentTimestamp).dividedBy(MAX_VECAKE_LOCK_WEEKS * WEEK),
      )
      return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
    }
    return 0
  }, [currentTimestamp, userVote?.end, userVote?.power, userVote?.slope])

  const onMax = () => {
    onChange('100')
  }

  const voteValue = useMemo(() => {
    if (voteDisabled) return powerPercent ?? ''
    return value ?? ''
  }, [voteDisabled, powerPercent, value])
  const votesAmount = useMemo(() => {
    const p = Number(voteValue || 0) * 100
    const amount = getBalanceNumber(veCake.times(p).div(10000))
    return amount < 1000 ? amount.toFixed(2) : formatLocalisedCompactNumber(amount, true)
  }, [veCake, voteValue])

  useEffect(() => {
    if (voteDisabled && !value) {
      onChange(voteValue)
    }
  }, [onChange, value, voteDisabled, voteValue])

  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        <GaugeTokenImage gauge={pool} />
        <Text fontWeight={600} fontSize={16}>
          {pool?.pairName}
        </Text>
        <FlexGap gap="5px" alignItems="center">
          <NetworkBadge chainId={Number(data?.chainId)} />
          {pool?.type === GaugeType.V3 ? (
            <Tag outline variant="secondary">
              {feeTierPercent(pool.feeTier)}
            </Tag>
          ) : null}

          <Tag variant="secondary">{pool ? GAUGE_TYPE_NAMES[pool.type] : ''}</Tag>
        </FlexGap>
      </FlexGap>
      <FlexGap alignItems="center" justifyContent="center" gap="4px">
        <Text bold>{power}</Text>
        <Text>{powerPercent ? ` (${powerPercent}%)` : null}</Text>
      </FlexGap>
      <Flex alignItems="center" pr="25px">
        {userVote?.voteLocked ? (
          <Tooltips
            content={t(
              'Gauge’s vote can not be changed more frequent than 10 days. You can update your vote for this gauge in: %distance%',
              {
                distance: userVote?.lastVoteTime
                  ? dayjs.unix(userVote?.lastVoteTime).add(10, 'day').from(dayjs.unix(currentTimestamp))
                  : '',
              },
            )}
          >
            <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
          </Tooltips>
        ) : null}
        <Text color={userVote?.voteLocked ? 'textDisabled' : ''}>{votesAmount} veCAKE</Text>
      </Flex>
      <Flex>
        <PercentInput
          disabled={voteDisabled}
          inputProps={{ disabled: voteDisabled }}
          onMax={onMax}
          value={voteValue}
          onUserInput={onChange}
        />
      </Flex>
    </TRow>
  )
}

export const ExpandRow: React.FC<{
  onCollapse?: () => void
  text?: string
  expandedText?: string
}> = ({ onCollapse, text, expandedText }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded((prev) => !prev)
    onCollapse?.()
  }, [onCollapse])
  const textToDisplay = expanded ? expandedText || t('Expanded') : text || t('Expand')

  return (
    <Flex alignItems="center" justifyContent="center" py="8px">
      <Button
        onClick={handleCollapse}
        variant="text"
        endIcon={expanded ? <ChevronUpIcon color="primary" /> : <ChevronDownIcon color="primary" />}
      >
        {textToDisplay}
      </Button>
    </Flex>
  )
}
