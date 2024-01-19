import { GAUGE_TYPE_NAMES, Gauge, GaugeType } from '@pancakeswap/gauges'
import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
import {
  Button,
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
  ErrorIcon,
  Flex,
  FlexGap,
  Grid,
  Tag,
  Text,
} from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useHover } from 'hooks/useHover'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { feeTierPercent } from 'views/V3Info/utils'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'
import { RowData } from './types'

const SelectButton = styled(Button)`
  &:disabled {
    background-color: transparent;
  }
`

const AddIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <g clip-path="url(#clip0_7260_24227)">
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z"
          fill="#31D0AA"
        />
      </g>
      <defs>
        <clipPath id="clip0_7260_24227">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

const TableRowItem: React.FC<{
  data: RowData
  selectable?: boolean
  locked?: boolean
  selected?: boolean
  onSelect?: (hash: Gauge['hash']) => void
  totalGaugesWeight?: number
  style?: React.CSSProperties
}> = ({ data, locked, totalGaugesWeight, selected, selectable, onSelect, style }) => {
  const { t } = useTranslation()

  const maxCapPercent = useMemo(() => {
    return new Percent(data?.maxVoteCap, 10000)
  }, [data.maxVoteCap])

  const currentWeightPercent = useMemo(() => {
    return new Percent(data.weight, totalGaugesWeight || 1)
  }, [data.weight, totalGaugesWeight])

  const hitMaxCap = useMemo(() => {
    return maxCapPercent.greaterThan(0) && currentWeightPercent.greaterThan(maxCapPercent)
  }, [maxCapPercent, currentWeightPercent])

  const currentWeight = useMemo(() => {
    return getBalanceNumber(new BN(String(data.weight || 0)))
  }, [data.weight])

  const [ref, isHover] = useHover<HTMLButtonElement>()

  return (
    <TRow style={style}>
      <FlexGap alignItems="center" gap="13px">
        {selectable ? (
          <span ref={ref}>
            <SelectButton
              variant="text"
              height={24}
              disabled={locked}
              p={0}
              mr="8px"
              onClick={() => onSelect?.(data.hash)}
            >
              {selected ? (
                isHover ? (
                  <CrossIcon color="#ED4B9E" />
                ) : (
                  <CheckmarkCircleFillIcon color="#BDC2C4" />
                )
              ) : (
                <AddIcon />
              )}
            </SelectButton>
          </span>
        ) : null}
        <Grid gridTemplateColumns="1fr 1fr" justifyContent="space-between" width="100%">
          <FlexGap alignItems="center" gap="13px">
            <GaugeTokenImage gauge={data} />
            <Text fontWeight={600} fontSize={16}>
              {data.pairName}
            </Text>
          </FlexGap>
          <FlexGap gap="5px" alignItems="center" flexWrap="wrap">
            <NetworkBadge chainId={Number(data.chainId)} />
            {data.type === GaugeType.V3 || data.type === GaugeType.V2 ? (
              <Tag outline variant="secondary">
                {feeTierPercent(data.feeTier)}
              </Tag>
            ) : null}

            <Tag variant="secondary">{data ? GAUGE_TYPE_NAMES[data.type] : ''}</Tag>
          </FlexGap>
        </Grid>
      </FlexGap>
      <Flex alignItems="center" pl="32px">
        <Tooltips
          disabled={!hitMaxCap}
          content={t(
            'This gauge has hit its voting cap. It can continue to receive votes, however, the vote numbers and allocation % will not increase until other gauges gain more votes.',
          )}
        >
          <Flex flexWrap="nowrap">
            <Text color={hitMaxCap ? 'failure' : ''} bold>
              {formatLocalisedCompactNumber(currentWeight, true)}
            </Text>
            <Text color={hitMaxCap ? 'failure' : ''} ml="2px">
              ({hitMaxCap ? maxCapPercent.toSignificant(2) : currentWeightPercent.toSignificant(2)}%)
            </Text>
            {hitMaxCap ? <ErrorIcon color="failure" style={{ marginBottom: '-2px' }} /> : null}
          </Flex>
        </Tooltips>
      </Flex>
      <Flex alignItems="center">
        <Text bold fontSize={16} color={data.boostMultiplier > 100n ? '#1BC59C' : undefined}>
          {Number(data.boostMultiplier) / 100}x
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Text bold={hitMaxCap}>
          {hitMaxCap ? 'MAX ' : ''}
          {maxCapPercent.toSignificant(2)}%
        </Text>
      </Flex>
    </TRow>
  )
}

export const TableRow = memo(TableRowItem)

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
