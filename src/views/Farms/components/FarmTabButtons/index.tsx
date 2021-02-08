import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, useLocation, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const FarmTabButtons = () => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()
  const location = useLocation()

  const getActiveIndex = () => {
    switch (location.pathname) {
      case `${url}/farming`:
        return 1
        break
      case `${url}/history`:
        return 2
        break
      default:
        return 0
        break
    }
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={getActiveIndex()} size="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {TranslateString(698, 'Active')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/farming`}>
          {TranslateString(699, 'Farming')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(700, 'Inactive')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`
