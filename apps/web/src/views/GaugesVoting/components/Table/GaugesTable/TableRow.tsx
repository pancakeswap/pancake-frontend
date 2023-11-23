import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
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
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { GAUGE_TYPE_NAMES, GaugeType } from 'config/constants/types'
import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useGaugeConfig } from 'views/GaugesVoting/hooks/useGaugePair'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { feeTierPercent } from 'views/V3Info/utils'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'

export const TableRow: React.FC<{
  data: GaugeVoting
  selectable?: boolean
  selected?: boolean
  onSelect?: (hash: GaugeVoting['hash']) => void
  totalGaugesWeight?: number
}> = ({ data, totalGaugesWeight, selected, selectable, onSelect }) => {
  const percentWeight = useMemo(() => {
    return new Percent(data?.weight, totalGaugesWeight || 1).toSignificant(2)
  }, [data?.weight, totalGaugesWeight])
  const percentCaps = useMemo(() => {
    return new Percent(data?.maxVoteCap, 10000).toSignificant(2)
  }, [data?.maxVoteCap])
  const pool = useGaugeConfig(data?.pairAddress as Address, Number(data?.chainId || undefined))

  const weight = useMemo(() => {
    return getBalanceNumber(new BN(data?.weight || 0))
  }, [data?.weight])

  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        {selectable ? (
          <Button variant="text" height={24} p={0} mr="8px" onClick={() => onSelect?.(data.hash)}>
            {selected ? <CheckmarkCircleFillIcon color="disabled" /> : <AddCircleIcon color="primary" />}
          </Button>
        ) : null}
        <GaugeTokenImage gauge={pool} />
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
      <Flex alignItems="center" pl="32px">
        <Text bold>{formatLocalisedCompactNumber(weight, true)}</Text>
        <Text>({percentWeight}%)</Text>
      </Flex>
      <Flex alignItems="center" pr="25px">
        <Text bold fontSize={16} color={data?.boostMultiplier > 100n ? '#1BC59C' : undefined}>
          {Number(data?.boostMultiplier) / 100}x
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
