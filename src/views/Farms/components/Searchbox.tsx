import React, { ReactElement, Dispatch } from 'react'
import styled from 'styled-components'
// import { Input } from '@pancakeswap-libs/uikit'

interface Props {
  searchText: string;
  onChange: Dispatch<string>;
}

const Container = styled.div`
  width: 320px;
  height: 64px;
  position: relative;
  
  .search-button {
    display: flex;
    align-items: center;
    position: absolute;
    float: right;
    height: 25px;
    top: 8px;
    right: 10px;
    
    span {
      line-height: 4px;
      color: #1FC7D4;
      margin-right: 8px;
      font-weight: 600;
      font-size: 1rem;
    }
  }
`

export default function SearchBox({ searchText, onChange }: Props): ReactElement {
  return (
    <Container>
      {/* <Input type="text" placeholder="Search forms" value={searchText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} /> */}
      <div className="search-button">
        <span>Search</span>
        <img src="/images/icons/search.svg" alt="search icon" />
      </div>
    </Container>
  )
}
