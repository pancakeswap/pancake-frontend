import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Toggle, Text, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const PoolTabButtons = ({ stakedOnly, setStakedOnly }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <Flex alignItems="center" justifyContent="center" mb="32px">
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {TranslateString(1198, 'Live')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(388, 'Finished')}
        </ButtonMenuItem>
      </ButtonMenu>
      <Flex ml="24px" justifyContent="center" alignItems="center">
        <Toggle scale="sm" checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
        <Text ml="8px" color={`${stakedOnly ? 'body' : 'textDisabled'}`}>
          {TranslateString(999, 'Staked only')}
        </Text>
      </Flex>
    </Flex>
  )
}

export default PoolTabButtons
