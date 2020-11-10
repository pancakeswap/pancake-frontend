/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'

import styled from 'styled-components'

import WarningTag from '../../CakeStaking/components/warningTag'

const Warning: React.FC = () => {
  return (
    <StyledWarning>
      <StyledTag>
        <WarningTag />
      </StyledTag>
      <Title>Action Required</Title>
      <p>
        SYRUP has been discontinued due to an issue discovered in the token contract.{' '}
        <b>All existing and future SYRUP Pools will be migrated to CAKE-based pools. </b>In order to continue earning
        from SYRUP pools, you need to:
        <br />
        1. Unstake from existing SYRUP pools
        <br />
        2. Redistribute your CAKE among the updated pools, which will use CAKE instead of SYRUP for staking.
        <br />
        3. Please ensure you have sufficient SYRUP when unstaking your CAKE.
        <br />
        <a
          href="https://medium.com/@pancakeswap/urgent-action-required-changes-to-syrup-pools-70b98d7b2541"
          target="_blank"
        >
          Read more
        </a>
      </p>
    </StyledWarning>
  )
}

const StyledWarning = styled.div`
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0px 0px 0px 1px #ed4b9e, 0px 0px 0px 4px rgba(237, 75, 158, 0.2);
  border-radius: 32px;
  padding: 20px;
  padding-left: 80px;
  position: relative;
  margin-top: 15px;
  p {
    color: #ed4b9e;
    line-height: 1.6rem;
  }
  a {
    color: #1fc7d4;
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
  color: #ed4b9e;
`

export default Warning
