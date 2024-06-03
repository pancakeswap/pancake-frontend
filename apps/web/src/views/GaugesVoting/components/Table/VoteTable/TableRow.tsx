import { GAUGE_TYPE_NAMES, GaugeType } from '@pancakeswap/gauges'
import { useTranslation } from '@pancakeswap/localization'
import { Button, ChevronDownIcon, ChevronUpIcon, ErrorIcon, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { stringify } from 'viem'
import { DebugTooltips, Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { getPositionManagerName } from 'views/GaugesVoting/utils'
import { feeTierPercent } from 'views/V3Info/utils'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { PositionManagerLogo } from '../../PositionManagerLogo'
import { VRow } from '../styled'
import { PercentInput } from './PercentInput'
import { useRowVoteState } from './hooks/useRowVoteState'
import { DEFAULT_VOTE, RowProps } from './types'

dayjs.extend(relativeTime)

const debugFormat = (unix?: bigint | number) => {
  if (!unix) return ''
  return dayjs.unix(Number(unix)).format('YYYY-MM-DD HH:mm:ss')
}

export const TableRow: React.FC<RowProps> = ({ data, submitted, vote = { ...DEFAULT_VOTE }, onChange }) => {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { cakeLockedAmount } = useCakeLockStatus()
  const cakeLocked = useMemo(() => cakeLockedAmount > 0n, [cakeLockedAmount])
  const userVote = useUserVote(data, submitted)
  const {
    currentVoteWeight,
    currentVotePercent,
    previewVoteWeight,
    voteValue,
    voteLocked,
    willUnlock,
    proxyVeCakeBalance,
    changeHighlight,
  } = useRowVoteState({
    data,
    vote,
    onChange,
  })
  const onMax = () => {
    onChange(vote, true)
  }

  return (
    <VRow data-gauge-hash={data.hash}>
      <FlexGap alignItems="center" gap="13px">
        <DebugTooltips
          content={
            <pre>
              {stringify(
                {
                  ...userVote,
                  currentTimestamp: debugFormat(currentTimestamp),
                  nativeLasVoteTime: debugFormat(userVote?.nativeLastVoteTime),
                  proxyLastVoteTime: debugFormat(userVote?.proxyLastVoteTime),
                  lastVoteTime: debugFormat(userVote?.lastVoteTime),
                  end: debugFormat(userVote?.end),
                  proxyEnd: debugFormat(userVote?.proxyEnd),
                  nativeEnd: debugFormat(userVote?.nativeEnd),
                  proxyVeCakeBalance: proxyVeCakeBalance?.toString(),
                  willUnlock,
                  voteLocked,
                  cakeLocked,
                },
                undefined,
                2,
              )}
            </pre>
          }
        >
          <GaugeTokenImage gauge={data} />
        </DebugTooltips>
        <Flex flexDirection="column">
          <Text fontWeight={600} fontSize={16}>
            {data.pairName}
          </Text>
          {data.type === GaugeType.ALM ? (
            <Flex alignItems="center">
              <PositionManagerLogo manager={getPositionManagerName(data)} />
              <Text fontSize={14} color="textSubtle">
                {getPositionManagerName(data)}
              </Text>
            </Flex>
          ) : null}
        </Flex>
      </FlexGap>

      <FlexGap gap="5px" alignItems="center">
        <NetworkBadge chainId={Number(data.chainId)} />
        {/* {[GaugeType.V3, GaugeType.V2].includes(data.type) ? ( */}
        {GaugeType.V3 === data.type || GaugeType.V2 === data.type ? (
          <Tag outline variant="secondary">
            {feeTierPercent(data.feeTier)}
          </Tag>
        ) : null}

        <Tag variant="secondary">{data ? GAUGE_TYPE_NAMES[data.type] : ''}</Tag>
      </FlexGap>
      <Flex alignItems="center" justifyContent="center" pl={16}>
        <Text bold>{currentVoteWeight}</Text>
        <Text>{currentVotePercent ? ` (${currentVotePercent}%)` : null}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" pr="25px">
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
        <Text
          bold={changeHighlight}
          color={voteLocked || willUnlock || !cakeLocked ? (changeHighlight ? 'textSubtle' : 'textDisabled') : ''}
        >
          {previewVoteWeight} veCAKE
        </Text>
      </Flex>
      <Flex>
        <PercentInput
          disabled={voteLocked || willUnlock || !cakeLocked}
          inputProps={{ disabled: voteLocked || willUnlock || !cakeLocked }}
          onMax={onMax}
          value={voteValue}
          onUserInput={(v) => onChange({ ...vote!, power: v })}
        />
      </Flex>
    </VRow>
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
  const textToDisplay = expanded ? expandedText || t('Collapse') : text || t('Expand')

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
