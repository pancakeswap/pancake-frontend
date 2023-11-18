import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, ChevronUpIcon, ErrorIcon, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceAmount, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { DoubleCurrencyLogo } from 'components/Logo'
import dayjs from 'dayjs'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useGaugePair } from 'views/GaugesVoting/hooks/useGaugePair'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { useVotedPower } from 'views/GaugesVoting/hooks/useVotedPower'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'
import { PercentInput } from './PercentInput'

export const TableRow: React.FC<{
  data: GaugeVoting
  value: string
  onChange: (value: string) => void
}> = ({ data, value, onChange }) => {
  const { t } = useTranslation()
  const votedPower = useVotedPower() ?? 0
  const { balance: veCake } = useVeCakeBalance()
  const votePower = useMemo(() => {
    return veCake.minus(votedPower)
  }, [veCake, votedPower])

  const pool = useGaugePair(data?.pairAddress.toLowerCase(), Number(data?.chainId || undefined))
  const { token0, token1, pairName } = pool
  const currency0 = useMemo<Token | undefined>(() => {
    if (token0?.address) return new Token(Number(data?.chainId), token0.address as Address, 18, '', '')
    return undefined
  }, [data?.chainId, token0?.address])
  const currency1 = useMemo((): Token | undefined => {
    if (token1?.address) return new Token(Number(data?.chainId), token1.address as Address, 18, '', '')
    return undefined
  }, [data?.chainId, token1?.address])

  const userVote = useUserVote(data)
  const voteDisabled = userVote?.voteLocked
  const powerPercent = useMemo(() => {
    return userVote?.power ? new Percent(userVote?.power, 10000).toSignificant(2) : undefined
  }, [userVote?.power])
  const power = useMemo(() => {
    if (veCake && userVote?.power) {
      return formatLocalisedCompactNumber(getBalanceNumber(veCake.times(userVote?.power).div(10000)), true)
    }
    return 0
  }, [userVote?.power, veCake])

  // const [input, setInput] = useState('')

  const onMax = () => {
    onChange('100')
  }

  const voteValue = useMemo(() => {
    if (voteDisabled) return powerPercent ?? ''
    return value ?? ''
  }, [voteDisabled, powerPercent, value])
  const votesAmount = useMemo(() => {
    return votePower.times(voteValue || 0).div(100)
  }, [voteValue, votePower])
  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
        <Text fontWeight={600} fontSize={16}>
          {pairName}
        </Text>
        <FlexGap gap="5px" alignItems="center">
          <NetworkBadge chainId={Number(data?.chainId)} />
          {pool.feeTier ? (
            <Tag outline variant="secondary">
              {pool.feeTier}
            </Tag>
          ) : null}

          <Tag variant="secondary">{pool.v3 ? 'V3' : 'V2'}</Tag>
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
                distance: userVote?.lastVoteTime ? dayjs.unix(userVote?.lastVoteTime).add(10, 'day').fromNow() : '',
              },
            )}
          >
            <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
          </Tooltips>
        ) : null}
        <Text color={userVote?.voteLocked ? 'textDisabled' : ''}>
          {getBalanceAmount(votesAmount).toFixed(2)} veCAKE
        </Text>
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
