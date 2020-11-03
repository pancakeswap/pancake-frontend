/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'

import styled from 'styled-components'

import WarningTag from './warningTag'

const Warning: React.FC = () => {

  return (
    <StyledWarning >
      <StyledTag>
        <WarningTag />
      </StyledTag>
      <Title>Urgent Action required</Title>
      <p>
        <b>Funds are safe.</b> Due to an exploit in the contract, SYRUP has been discontinued and SYRUP Pools will be migrated to new CAKE-based pools. In order to continue earning from the new pools, you must: 
        <br/>
                1) Unstake from all <b>existing SYRUP pools</b>
          <br/>
        2) Unstake your SYRUP from <b>staking</b>
        <br/>
        3) Migrate to <b>new pools</b>, which will use CAKE instead of SYRUP for staking.
        <br/>
        <br/>

        <a href="https://medium.com/@pancakeswap/urgent-action-required-changes-to-syrup-pools-70b98d7b2541" target="_blank">
        Read more
        </a>
      </p>

    </StyledWarning>
  )
}

const StyledWarning = styled.div`
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0px 0px 0px 1px #ED4B9E, 0px 0px 0px 4px rgba(237, 75, 158, 0.2);
  border-radius: 32px;
  padding: 20px;
  padding-left: 80px;
  position: relative;
  margin-top: 15px;
  p {
    color: #ED4B9E;
    line-height: 1.6rem;
  }
  a {
    color: #1FC7D4;
  }
`
const StyledTag = styled.div`
  left: 20px;
  top: 25px;
  position: absolute;
`

const Title = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 110%;
  color: #ED4B9E;
`

export default Warning
