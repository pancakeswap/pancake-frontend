import { styled } from 'styled-components'
import { Text, Flex, Toggle, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useStakeOnly } from '../hooks'

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
  const { isMobile } = useMatchBreakpoints()

  return (
    <ToggleWrapper>
      <Toggle checked={stakeOnly} onChange={toggle} scale="sm" />
      <Text>{isMobile ? t('Staked') : t('Staked only')}</Text>
    </ToggleWrapper>
  )
}
