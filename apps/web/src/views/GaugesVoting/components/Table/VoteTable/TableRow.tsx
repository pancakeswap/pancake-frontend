import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, ChevronUpIcon, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { DoubleCurrencyLogo } from 'components/Logo'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
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

  const slopePercent = useMemo(() => {
    return userVote?.slope ? new Percent(userVote?.slope, 10000).toFixed(2) : undefined
  }, [userVote?.slope])

  // const [input, setInput] = useState('')
  const votesAmount = useMemo(() => {
    return votePower.times(value || 0).div(100)
  }, [value, votePower])
  const onMax = () => {
    onChange('100')
  }

  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
        <Text fontWeight={600} fontSize={16}>
          {pairName} {votePower.toString()}
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
      <Flex alignItems="center" justifyContent="center">
        <Text bold>{userVote?.power ? formatLocalisedCompactNumber(userVote?.power, true) : '0'}</Text>
        <Text>{slopePercent ? `(${slopePercent})` : null}</Text>
      </Flex>
      <Flex alignItems="center" pr="25px">
        <Text>{getBalanceAmount(votesAmount).toFixed(2)} veCAKE</Text>
      </Flex>
      <Flex>
        <PercentInput onMax={onMax} value={value} onUserInput={onChange} />
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
