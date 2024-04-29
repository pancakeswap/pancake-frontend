import { ChainId } from '@pancakeswap/chains'
import { GAUGES_SUPPORTED_CHAIN_IDS } from '@pancakeswap/gauges'
import { Trans, useTranslation } from '@pancakeswap/localization'
import { AutoRow, Checkbox, FlexGap, GroupsIcon, RocketIcon, Tag, Text, VoteIcon } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import styled from 'styled-components'
import { v3FeeToPercent } from 'views/Swap/V3Swap/utils/exchange'
import { NetworkBadge } from '../NetworkBadge'
import { Gauges, OptionsType } from './type'

export const OPTIONS = {
  [OptionsType.ByChain]: {
    key: OptionsType.ByChain,
    title: <Trans>Filter By Chains</Trans>,
    options: GAUGES_SUPPORTED_CHAIN_IDS,
  },
  [OptionsType.ByFeeTier]: {
    key: OptionsType.ByFeeTier,
    title: <Trans>Filter By Fee Tier</Trans>,
    options: [FeeAmount.HIGH, FeeAmount.MEDIUM, FeeAmount.LOW, FeeAmount.LOWEST],
  },
  [OptionsType.ByType]: {
    key: OptionsType.ByType,
    title: <Trans>Filter By Type</Trans>,
    options: [Gauges.Regular, Gauges.Boosted, Gauges.Capped] as Gauges[],
  },
}

const Label = styled.label`
  cursor: pointer;
  padding: 8px 32px;
  padding-right: 42px;
  margin: 0 -32px;
  transition: background-color 200ms ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

const ByChainsOption: React.FC<{
  option: ChainId
  checked: boolean
  onChange: (chainId: ChainId) => void
}> = ({ checked, option, onChange }) => {
  const id = `option-by-chain-${option}`
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <Label htmlFor={id}>
      <AutoRow justifyContent="space-between">
        <NetworkBadge color="pure-black" chainId={option} />
        <Checkbox checked={checked} onChange={() => onChange(option)} scale="sm" id={id} />
      </AutoRow>
    </Label>
  )
}

const ByFeeTierOption: React.FC<{
  option: FeeAmount
  checked: boolean
  onChange: (feeAmount: FeeAmount) => void
}> = ({ checked, option, onChange }) => {
  const id = `option-by-fee-tier-${option}`
  const percent = v3FeeToPercent(option)
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <Label htmlFor={id}>
      <AutoRow justifyContent="space-between">
        <Tag outline>{percent.toSignificant(3)}%</Tag>
        <Checkbox checked={checked} onChange={() => onChange(option)} scale="sm" id={id} />
      </AutoRow>
    </Label>
  )
}

const GAUGES_TYPE = ['Regular Gauges', 'Boosted Gauges', 'Capped Gauges'] as const

const GaugesIcon = {
  [GAUGES_TYPE[0]]: <VoteIcon color="textSubtle" />,
  [GAUGES_TYPE[1]]: <RocketIcon color="textSubtle" />,
  [GAUGES_TYPE[2]]: <GroupsIcon color="textSubtle" />,
}
const ByTypeOption: React.FC<{
  option: Gauges
  checked: boolean
  onChange: (type: Gauges) => void
}> = ({ checked, option, onChange }) => {
  const id = `option-by-fee-tier-${String(option)}`
  const { t } = useTranslation()
  const icon = GaugesIcon[option]
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <Label htmlFor={id}>
      <AutoRow justifyContent="space-between">
        <FlexGap gap="8px">
          {icon}
          <Text fontSize={16} fontWeight={600}>
            {t(String(option))}
          </Text>
        </FlexGap>
        <Checkbox checked={checked} onChange={() => onChange(option)} scale="sm" id={id} />
      </AutoRow>
    </Label>
  )
}

export const FilterOption: React.FC<{
  type: OptionsType
  option: Gauges | ChainId | FeeAmount
  checked: boolean
  onChange: (type: OptionsType, value: Gauges | ChainId | FeeAmount) => void
}> = ({ type, option, checked, onChange }) => {
  switch (type) {
    case OptionsType.ByChain:
      return (
        <ByChainsOption
          checked={checked}
          option={option as ChainId}
          onChange={(value) => onChange(OptionsType.ByChain, value)}
        />
      )
    case OptionsType.ByFeeTier:
      return (
        <ByFeeTierOption
          checked={checked}
          option={option as FeeAmount}
          onChange={(value) => onChange(OptionsType.ByFeeTier, value)}
        />
      )
    case OptionsType.ByType:
      return (
        <ByTypeOption
          checked={checked}
          option={option as Gauges}
          onChange={(value) => onChange(OptionsType.ByType, value)}
        />
      )
    default:
      return null
  }
}
