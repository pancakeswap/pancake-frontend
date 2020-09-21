// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/chef.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from './PageHeader'
import Spacer from '../../components/Spacer'


const Coming: React.FC = () => {

  const [currentTime, setCurrentTime] = React.useState(Date.parse(new Date())/1000);

  const endTime = 1600783200
  const seconds  = (endTime - currentTime) % 60
  const minutes  = (endTime - currentTime) % 3600 / 60
  const hours  = (endTime - currentTime) % (3600 * 24) / 3600
  const days  = (endTime - currentTime) / (3600 * 24)


  const tick = () => {
    setCurrentTime(currentTime + 1)
  };

  React.useEffect(() => {
    // 执行定时
    let timerID = setInterval(() => tick(), 1000);
    // 卸载组件时进行清理
    return () => clearInterval(timerID);
  });

  return (
    <Page>
      <PageHeader
        icon={'🥞'}
        title="CAKE will start flipping in"
      />
      <StyledInfo>
        <Countdown>{parseInt(days ? days : '0')}</Countdown>D
        <Countdown>{parseInt(hours)}</Countdown>H
        <Countdown>{parseInt(minutes)}</Countdown>M
        <Countdown>{seconds}</Countdown>S
      </StyledInfo>
    </Page>
  )
}

const StyledInfo = styled.div`
    background: #FFFDFA;
    box-shadow: 0px 2.2623px 11.3115px rgba(171, 133, 115, 0.16);
    border-radius: 50px;
    font-size: 25px;
    color: #7645D9;
    font-weight: 900;
    height: 120px;
    padding: 20px;
    width: 600px;
    text-align: center;
    padding-top: 200px;
    position: relative;
    margin-top: -200px;
    z-index: -1;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

const Countdown = styled.div`
  display: inline-block;
  width: 80px;
  background: linear-gradient(180deg, #54DADE 0%, #24C7D6 76.22%);
  border-radius: 12.8px;
  font-family: monospace;
  font-size: 58px;
  color: #452A7A;
  letter-spacing: 0;
  text-align: center;
  margin-left: 10px;
  text-shadow: 0 2px 21px rgba(10,16,128,0.08);
`


export default Coming
