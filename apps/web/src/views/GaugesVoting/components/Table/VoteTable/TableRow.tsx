import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Native, Token } from '@pancakeswap/sdk'
import { USDC } from '@pancakeswap/tokens'
import { Button, ChevronDownIcon, ChevronUpIcon, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import { DoubleCurrencyLogo } from 'components/Logo'
import { useCallback, useState } from 'react'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'
import { PercentInput } from './PercentInput'

export const TableRow = () => {
  const currency0 = Native.onChain(ChainId.ETHEREUM)
  const currency1 = new Token(ChainId.ETHEREUM, USDC[1].address, 18, '', '')

  return (
    <TRow>
      <FlexGap alignItems="center" gap="13px">
        <DoubleCurrencyLogo size={32} currency0={currency0} currency1={currency1} />
        <Text fontWeight={600} fontSize={16}>
          ETH-USDC
        </Text>
        <FlexGap gap="5px" alignItems="center">
          <NetworkBadge chainId={ChainId.POLYGON_ZKEVM} />
          <Tag outline variant="secondary">
            0.25%
          </Tag>
          <Tag variant="secondary">V3</Tag>
        </FlexGap>
      </FlexGap>
      <Flex alignItems="center" justifyContent="center">
        <Text>1.4M</Text>
        <Text>(2.79%)</Text>
      </Flex>
      <Flex alignItems="center" pr="25px">
        <Text>10 veCAKE</Text>
      </Flex>
      <Flex>
        <PercentInput value={99} onUserInput={console.debug} />
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
