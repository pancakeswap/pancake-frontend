import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Text, Toggle, Input } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  > * {
    margin-bottom: 16px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    > * {
      margin-bottom: 0px;
      margin-left: 8px;
      margin-right: 8px;
    }
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${Text} {
    margin-left: 8px;
  }
`

const StyledInputFilter = styled(Input)`
  max-width: 300px;
`

interface TabToolbarProps {
  account: number | string
  stakedOnly: boolean
  setStakedOnly: (boolean) => void
  filter: string
  setFilter: (boolean) => void
}

const TabToolbar: React.FC<TabToolbarProps> = ({ account, stakedOnly, setStakedOnly, filter, setFilter }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} size="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {TranslateString(698, 'Active')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(700, 'Inactive')}
        </ButtonMenuItem>
      </ButtonMenu>
      {account && (
        <ToggleWrapper>
          <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
          <Text> {TranslateString(699, 'Staked only')}</Text>
        </ToggleWrapper>
      )}
      <StyledInputFilter
        type="text"
        scale="md"
        placeholder={TranslateString(999, 'Filter')}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </Wrapper>
  )
}

export default TabToolbar
