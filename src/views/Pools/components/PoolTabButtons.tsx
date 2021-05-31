import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import {
  ButtonMenu,
  ButtonMenuItem,
  Toggle,
  Text,
  Flex,
  NotificationDot,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ToggleView, { ViewMode } from './ToggleView/ToggleView'

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools, viewMode, setViewMode }) => {
  const { url, isExact } = useRouteMatch()
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()

  const viewModeToggle = <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />

  const liveOrFinishedSwitch = (
    <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
      <ButtonMenuItem as={Link} to={`${url}`}>
        {t('Live')}
      </ButtonMenuItem>
      <NotificationDot show={hasStakeInFinishedPools}>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {t('Finished')}
        </ButtonMenuItem>
      </NotificationDot>
    </ButtonMenu>
  )

  const stakedOnlySwitch = (
    <Flex mt={['4px', null, 0, null]} ml={[0, null, '24px', null]} justifyContent="center" alignItems="center">
      <Toggle scale="sm" checked={stakedOnly} onChange={() => setStakedOnly((prev) => !prev)} />
      <Text ml={['4px', '4px', '8px']}>{t('Staked only')}</Text>
    </Flex>
  )

  if (isXs || isSm) {
    return (
      <Flex flexDirection="column" alignItems="flex-start" mb="24px">
        <Flex width="100%" justifyContent="space-between">
          {viewModeToggle}
          {liveOrFinishedSwitch}
        </Flex>
        {stakedOnlySwitch}
      </Flex>
    )
  }

  return (
    <Flex
      alignItems="center"
      justifyContent={['space-around', 'space-around', 'flex-start']}
      mb={['24px', '24px', '24px', '0px']}
    >
      {viewModeToggle}
      {liveOrFinishedSwitch}
      {stakedOnlySwitch}
    </Flex>
  )
}

export default PoolTabButtons
