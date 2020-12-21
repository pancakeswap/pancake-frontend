import React, { ReactElement } from 'react'
import styled from 'styled-components'

interface Props {
  inputText: string;
}

const Container = styled.form`
  width: 320px;
  height: 64px;
  display: block;
  position: relative;

  input#search-bar {
    background: #EEEAF4;

    box-shadow: inset 0px 2px 2px -1px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    font-size: 1rem;
    border: 1px solid #D0CFCE;
    outline: none;
    &:focus{
      border: 1px solid #008ABF;
      transition: 0.35s ease;
      color: #008ABF;
      &::-webkit-input-placeholder{
        transition: opacity 0.45s ease; 
        opacity: 0;
      }
      &::-moz-placeholder {
        transition: opacity 0.45s ease; 
        opacity: 0;
      }
      &:-ms-placeholder {
      transition: opacity 0.45s ease; 
      opacity: 0;
      }    
    }
  }
  
  .search-button {
    display: flex;
    align-items: center;
    position: absolute;
    float: right;
    height: 25px;
    top: 20px;
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

export default function SearchBox({ inputText }: Props): ReactElement {
  return (
    <Container>
      <input type="text" id="search-bar" placeholder="Search forms" />
      <div className="search-button">
        <span>Search</span>
        <img src="/images/icons/search.svg" alt="search icon" />
      </div>
    </Container>
  )
}
