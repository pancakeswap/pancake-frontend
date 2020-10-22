// @ts-nocheck
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {currentLotteryState, LotteryStates} from "../../../lottery/types";

const Time: React.FC = () => {

  const [currentTime, setCurrentTime] = React.useState(Date.parse(new Date())/1000);

  const endTime = 1603458000
  const seconds  = (endTime - currentTime) % 60
  const minutes  = (endTime - currentTime) % 3600 / 60
  const hours  = (endTime - currentTime) % (3600 * 24) / 3600
  const days  = (endTime - currentTime) / (3600 * 24)


  const tick = () => {
    setCurrentTime(currentTime + 1)
  };


    const stateDeadlineTime = `${parseInt(days)}d, ${parseInt(hours)}h, ${parseInt(minutes)}m, ${parseInt(seconds)}s`
    const state = currentLotteryState();

    return (
        <div  style={{marginBottom: '1em'}}>
            <Title style={{marginTop: '2em'}}>⏳</Title>
            <Title>Approx. time before next lottery start</Title>
            <Title2>{stateDeadlineTime}</Title2>
        </div>
    )
}

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size:26px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`

const Title2 = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size:36px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`


export default Time
