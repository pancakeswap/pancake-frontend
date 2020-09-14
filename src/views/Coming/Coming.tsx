import React from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/chef.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from './PageHeader'
import Spacer from '../../components/Spacer'


const Coming: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon={<img src={chef} height={120} />}
        title="Coming Soon..."
      />
      <StyledInfo>
        <Countdown>?</Countdown>D
        <Countdown>?</Countdown>H
        <Countdown>?</Countdown>M
        <Countdown>?</Countdown>S
      </StyledInfo>
    </Page>
  )
}

const StyledInfo = styled.div`
    background: #F5F3F3;
    box-shadow: -11px -11px 15px 0 rgba(255,255,255,0.50), 16px 10px 32px 2px rgba(202,194,194,0.42), inset -8px -9px 11px 0 rgba(255,255,255,0.21), inset 14px 7px 30px 0 rgba(204,183,183,0.08);
    border-radius: 50px;
    font-size: 25px;
    color: #78D4E2;
    font-weight: 900;
    height: 140px;
    padding: 0 40px;
    padding-top: 200px;
    position: relative;
    margin-top: -210px;
    z-index: -1;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

const Countdown = styled.div`
  display: inline-block;
  width: 80px;
  background: rgba(220,228,234,0.51);
  border-radius: 12.8px;
  font-family: monospace;
  font-size: 61.44px;
  color: #2E575D;
  letter-spacing: 0;
  text-align: center;
  text-shadow: 0 2px 21px rgba(10,16,128,0.08);
`


export default Coming
