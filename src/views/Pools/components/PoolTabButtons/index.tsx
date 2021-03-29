import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Toggle, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const PoolTabButtons = ({ stakedOnly, setStakedOnly }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {TranslateString(1198, 'Live')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(388, 'Finished')}
        </ButtonMenuItem>
      </ButtonMenu>
      <ToggleWrapper>
        <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
        <Text> {TranslateString(999, 'Staked only')}</Text>
      </ToggleWrapper>
    </Wrapper>
  )
}

export default PoolTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 32px;

  ${Text} {
    margin-left: 8px;
  }
`
