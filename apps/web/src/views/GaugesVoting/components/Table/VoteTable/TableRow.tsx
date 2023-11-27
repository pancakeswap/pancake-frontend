import { useTranslation } from '@pancakeswap/localization'
import { Button, ChevronDownIcon, ChevronUpIcon, ErrorIcon, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import { GAUGE_TYPE_NAMES, GaugeType } from 'config/constants/types'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { Address, stringify } from 'viem'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useGaugeConfig } from 'views/GaugesVoting/hooks/useGaugePair'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { feeTierPercent } from 'views/V3Info/utils'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'
import { PercentInput } from './PercentInput'
import { useRowVoteState } from './hooks/useRowVoteState'
import { DEFAULT_VOTE, RowProps } from './types'

const debugFormat = (unix?: bigint | number) => {
  if (!unix) return ''
  return dayjs.unix(Number(unix)).format('YYYY-MM-DD HH:mm:ss')
}

export const TableRow: React.FC<RowProps> = ({ data, vote = DEFAULT_VOTE, onChange }) => {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const pool = useGaugeConfig(data?.pairAddress as Address, Number(data?.chainId || undefined))
  const userVote = useUserVote(data)
  const { currentVoteWeight, currentVotePercent, previewVoteWeight, voteValue, voteLocked, willUnlock } =
    useRowVoteState({
      data,
      vote,
      onChange,
    })

  const onMax = () => {
    onChange(vote, true)
  }

  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        <Tooltips
          disabled={!(window.location.hostname === 'localhost' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview')}
          content={
            <pre>
              {stringify(
                {
                  ...userVote,
                  currentTimestamp: debugFormat(currentTimestamp),
                  nativeLasVoteTime: debugFormat(userVote?.lastVoteTime),
                  proxyLastVoteTime: debugFormat(userVote?.proxyLastVoteTime),
                  lastVoteTime: debugFormat(userVote?.lastVoteTime),
                  end: debugFormat(userVote?.end),
                  proxyEnd: debugFormat(userVote?.proxyEnd),
                  nativeEnd: debugFormat(userVote?.nativeEnd),
                },
                undefined,
                2,
              )}
            </pre>
          }
        >
          <GaugeTokenImage gauge={pool} />
        </Tooltips>
        <Text fontWeight={600} fontSize={16}>
          {pool?.pairName}
        </Text>
        <FlexGap gap="5px" alignItems="center">
          <NetworkBadge chainId={Number(data?.chainId)} />
          {[GaugeType.V3, GaugeType.V2].includes(pool?.type) ? (
            <Tag outline variant="secondary">
              {feeTierPercent(pool.feeTier)}
            </Tag>
          ) : null}

          <Tag variant="secondary">{pool ? GAUGE_TYPE_NAMES[pool.type] : ''}</Tag>
        </FlexGap>
      </FlexGap>
      <FlexGap alignItems="center" justifyContent="center" gap="4px">
        <Text bold>{currentVoteWeight}</Text>
        <Text>{currentVotePercent ? ` (${currentVotePercent}%)` : null}</Text>
      </FlexGap>
      <Flex alignItems="center" pr="25px">
        {voteLocked ? (
          <Tooltips
            content={t(
              'Gauge’s vote can not be changed more frequent than 10 days. You can update your vote for this gauge in: %distance%',
              {
                distance: userVote?.lastVoteTime
                  ? dayjs.unix(Number(userVote?.lastVoteTime)).add(10, 'day').from(dayjs.unix(currentTimestamp), true)
                  : '',
              },
            )}
          >
            <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
          </Tooltips>
        ) : null}
        <Text color={voteLocked || willUnlock ? 'textDisabled' : ''}>{previewVoteWeight} veCAKE</Text>
      </Flex>
      <Flex>
        <PercentInput
          disabled={voteLocked || willUnlock}
          inputProps={{ disabled: voteLocked || willUnlock }}
          onMax={onMax}
          value={voteValue}
          onUserInput={(v) => onChange({ ...vote!, power: v })}
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
