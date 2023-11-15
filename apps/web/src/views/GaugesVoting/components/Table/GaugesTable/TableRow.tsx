import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, ChevronUpIcon, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber from '@pancakeswap/utils/formatBalance'
import { DoubleCurrencyLogo } from 'components/Logo'
import { useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { useV2PairData, useV3PoolData } from 'views/GaugesVoting/hooks/useGaugePair'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { feeTierPercent } from 'views/V3Info/utils'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'

export const TableRow: React.FC<{
  data: GaugeVoting
  totalGauges?: number
}> = ({ data, totalGauges }) => {
  const percentWeight = useMemo(() => {
    return new Percent(data?.weight, totalGauges || 1).toFixed(2)
  }, [data?.weight, totalGauges])
  const percentCaps = useMemo(() => {
    return new Percent(data?.maxVoteCap, 10000).toFixed(0)
  }, [data?.maxVoteCap])
  const v2PoolData = useV2PairData(data?.pairAddress.toLowerCase(), Number(data?.chainId || undefined))
  const v3PoolData = useV3PoolData(data?.pairAddress.toLowerCase(), Number(data?.chainId || undefined))

  const token0 = useMemo(() => {
    if (v2PoolData) return v2PoolData.token0
    if (v3PoolData) return v3PoolData.token0
    return undefined
  }, [v2PoolData, v3PoolData])

  const token1 = useMemo(() => {
    if (v2PoolData) return v2PoolData.token1
    if (v3PoolData) return v3PoolData.token1
    return undefined
  }, [v2PoolData, v3PoolData])
  const currency0 = useMemo<Token | undefined>(() => {
    if (token0?.address) return new Token(Number(data?.chainId), token0.address as Address, 18, '', '')
    return undefined
  }, [data?.chainId, token0?.address])
  const currency1 = useMemo((): Token | undefined => {
    if (token1?.address) return new Token(Number(data?.chainId), token1.address as Address, 18, '', '')
    return undefined
  }, [data?.chainId, token1?.address])
  const pairName = useMemo(() => {
    return `${token0?.symbol}-${token1?.symbol}`
  }, [token0?.symbol, token1?.symbol])
  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
        <Text fontWeight={600} fontSize={16}>
          {pairName}
        </Text>
        <FlexGap gap="5px" alignItems="center">
          <NetworkBadge chainId={Number(data?.chainId)} />
          {v3PoolData?.feeTier ? (
            <Tag outline variant="secondary">
              {feeTierPercent(v3PoolData?.feeTier)}
            </Tag>
          ) : null}

          <Tag variant="secondary">{v3PoolData ? 'V3' : 'V2'}</Tag>
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
