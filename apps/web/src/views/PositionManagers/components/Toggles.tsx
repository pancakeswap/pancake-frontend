import styled from 'styled-components'
import { Text, Flex, Toggle } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useStakeOnly, useBooster } from '../hooks'

const ToggleWrapper = styled(Flex).attrs({
  alignItems: 'center',
  ml: '0.75em',
})`
  ${Text} {
    margin-left: 0.5em;
  }
`

export function StakeOnlyToggle() {
  const [stakeOnly, toggle] = useStakeOnly()
  const { t } = useTranslation()

  return (
    <ToggleWrapper>
      <Toggle checked={stakeOnly} onChange={toggle} scale="sm" />
      <Text> {t('Staked only')}</Text>
    </ToggleWrapper>
  )
}

export function BoosterToggle() {
  const [booster, toggle] = useBooster()
  const { t } = useTranslation()

  return (
    <ToggleWrapper>
      <Toggle checked={booster} onChange={toggle} scale="sm" />
      <Text> {t('Booster Available')}</Text>
    </ToggleWrapper>
  )
}
