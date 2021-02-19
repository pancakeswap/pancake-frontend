import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Text, Toggle, Input } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const FarmSearch = () => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  const searchFarms = (event) => {
    const CardPairs = document.querySelectorAll('.f-card-pair')
    const SearchPattern = event.target.value
    if (SearchPattern) {
      if (CardPairs) {
        for (let i = 0; i < CardPairs.length; i++) {
          if (CardPairs[i].innerHTML.toLocaleLowerCase().includes(SearchPattern.toLocaleLowerCase())) {
            CardPairs[i].closest<HTMLElement>('.f-card').style.display = 'block'
          } else {
            CardPairs[i].closest<HTMLElement>('.f-card').style.display = 'none'
          }
        }
      }
    } else {
      for (let i = 0; i < CardPairs.length; i++) {
        CardPairs[i].closest<HTMLElement>('.f-card').style.display = 'block'
      }
    }
  }

  return (
    <Wrapper>
      <Input type="text" onChange={searchFarms} />
    </Wrapper>
  )
}

export default FarmSearch

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`
