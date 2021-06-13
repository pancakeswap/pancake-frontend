import React from 'react'
import styled from 'styled-components'
import { BaseLayout } from '@rug-zombie-libs/uikit'

const Card = styled(BaseLayout) `
  padding: 16px;
  border: 2px solid rgb(204, 246, 108);
  border-radius: 16px;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-basis: 0px;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      margin-left: 12px;
      margin-right: 12px;
      margin-bottom: 0px;
      max-height: 100px;
    }
  } 
  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      margin-left: 12px;
      margin-right: 12px;
      margin-bottom: 0px;
      max-height: 100px;
    }
  }
`
const SmallText = styled(BaseLayout) ` 
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 8px;
`
const SpaceBetween = styled(BaseLayout) `
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
`

const StartFarming: React.FC = () => {
  return (
    <div className="frank-card">
      <div className="small-text">
        <span className="white-color">START FARMING</span>
      </div>
      <div className="space-between">
        <button className="btn btn-disabled w-100" type="button">Unlock Wallet</button>
      </div>
    </div>
  )
}

export default StartFarming