import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/sdk'
import {
  AddCircleIcon,
  Button,
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  FlexGap,
  Tag,
  Text,
} from '@pancakeswap/uikit'
import formatLocalisedCompactNumber from '@pancakeswap/utils/formatBalance'
import { DoubleCurrencyLogo } from 'components/Logo'
import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useGaugePair } from 'views/GaugesVoting/hooks/useGaugePair'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'

export const TableRow: React.FC<{
  data: GaugeVoting
  selectable?: boolean
  selected?: boolean
  onSelect?: (hash: GaugeVoting['hash']) => void
  totalGauges?: number
}> = ({ data, totalGauges, selected, selectable, onSelect }) => {
  const percentWeight = useMemo(() => {
    return new Percent(data?.weight, totalGauges || 1).toFixed(2)
  }, [data?.weight, totalGauges])
  const percentCaps = useMemo(() => {
    return new Percent(data?.maxVoteCap, 10000).toSignificant(2)
  }, [data?.maxVoteCap])
  const pool = useGaugePair(data?.pairAddress.toLowerCase(), Number(data?.chainId || undefined))

  const currency0 = useMemo<Token | undefined>(() => {
    if (pool.token0?.address) return new Token(Number(data?.chainId), pool.token0.address as Address, 18, '', '')
    return undefined
  }, [data?.chainId, pool.token0?.address])
  const currency1 = useMemo((): Token | undefined => {
    if (pool.token1?.address) return new Token(Number(data?.chainId), pool.token1.address as Address, 18, '', '')
    return undefined
  }, [data?.chainId, pool.token1?.address])

  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        {selectable ? (
          <Button variant="text" height={24} p={0} mr="8px" onClick={() => onSelect?.(data.hash)}>
            {selected ? <CheckmarkCircleFillIcon color="disabled" /> : <AddCircleIcon color="primary" />}
          </Button>
        ) : null}
        <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
        <Text fontWeight={600} fontSize={16}>
          {pool.pairName}
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
      <Flex alignItems="center">
        <Text bold>{formatLocalisedCompactNumber(data?.weight, true)}</Text>
        <Text>({percentWeight}%)</Text>
      </Flex>
      <Flex alignItems="center" pr="25px">
        <Text bold fontSize={16} color={data?.boostMultiplier > 100n ? '#1BC59C' : undefined}>
          {Number(data?.boostMultiplier / 100n)}x
        </Text>
      </Flex>

      <Text bold>{percentCaps}%</Text>
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
