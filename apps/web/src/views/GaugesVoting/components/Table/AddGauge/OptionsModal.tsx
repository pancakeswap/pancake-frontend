import { ChainId } from '@pancakeswap/chains'
import { Trans, useTranslation } from '@pancakeswap/localization'
import {
  AutoRow,
  Box,
  Checkbox,
  FlexGap,
  GroupsIcon,
  Modal,
  ModalV2,
  RocketIcon,
  Tag,
  Text,
  VoteIcon,
} from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import React from 'react'
import styled from 'styled-components'
import { v3FeeToPercent } from 'views/Swap/V3Swap/utils/exchange'
import { NetworkBadge } from '../../NetworkBadge'

const Label = styled.label`
  cursor: pointer;
  padding: 8px 32px;
  margin: 0 -32px;
  transition: background-color 200ms ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

export enum OptionsType {
  ByChain = 'byChain',
  ByFeeTier = 'byFeeTier',
  ByType = 'byType',
}

export const GAUGES_TYPE = ['Regular Gauges', 'Boosted Gauges', 'Capped Gauges'] as const

export type GaugesType = keyof typeof GAUGES_TYPE

const GaugesIcon = {
  [GAUGES_TYPE[0]]: <VoteIcon color="textSubtle" />,
  [GAUGES_TYPE[1]]: <RocketIcon color="textSubtle" />,
  [GAUGES_TYPE[2]]: <GroupsIcon color="textSubtle" />,
}

const OPTIONS = {
  [OptionsType.ByChain]: {
    key: OptionsType.ByChain,
    title: <Trans>Filter By Chains</Trans>,
    options: [
      ChainId.ETHEREUM,
      ChainId.BSC,
      ChainId.ZKSYNC,
      ChainId.POLYGON_ZKEVM,
      ChainId.ARBITRUM_ONE,
      ChainId.LINEA,
      ChainId.BASE,
    ],
  },
  [OptionsType.ByFeeTier]: {
    key: OptionsType.ByFeeTier,
    title: <Trans>Filter By Fee Tier</Trans>,
    options: [FeeAmount.HIGH, FeeAmount.MEDIUM, FeeAmount.LOW, FeeAmount.LOWEST],
  },
  [OptionsType.ByType]: {
    key: OptionsType.ByType,
    title: <Trans>Filter By Type</Trans>,
    options: GAUGES_TYPE,
  },
}

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

const ByTypeOption: React.FC<{
  option: GaugesType
  checked: boolean
  onChange: (type: GaugesType) => void
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

const Option: React.FC<{
  type: OptionsType
  option: GaugesType | ChainId | FeeAmount
  checked: boolean
  onChange: (type: OptionsType, value: GaugesType | ChainId | FeeAmount) => void
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
          option={option as GaugesType}
          onChange={(value) => onChange(OptionsType.ByType, value)}
        />
      )
    default:
      return null
  }
}

export type Filter = {
  [OptionsType.ByChain]: ChainId[]
  [OptionsType.ByFeeTier]: FeeAmount[]
  [OptionsType.ByType]: GaugesType[]
}

export const OptionsModal: React.FC<{
  isOpen: boolean
  onDismiss: () => void
  type: OptionsType | null
  options: Filter
  onChange: (type: OptionsType, value: GaugesType | ChainId | FeeAmount) => void
}> = ({ isOpen, type, onDismiss, options, onChange }) => {
  if (!type) return null
  const allChecks = options[type] as Array<unknown>

  return (
    <ModalV2 isOpen={isOpen} onDismiss={onDismiss}>
      <Modal title={OPTIONS[type].title} headerBackground="gradientCardHeader">
        <FlexGap flexDirection="column" gap="8px">
          {OPTIONS[type].options.map((option) => {
            const checked = allChecks.includes(option)
            return <Option type={type} key={OPTIONS[type].key} option={option} checked={checked} onChange={onChange} />
          })}
        </FlexGap>
      </Modal>
    </ModalV2>
  )
}
