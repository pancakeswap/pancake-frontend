import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {currentLotteryState, LotteryStates} from "../../../lottery/types";

const Time: React.FC = () => {
    const stateDeadlineTime = '22h, 30m, 10s'
    const stateDeadlineBlocks = '1,301'
    const state = currentLotteryState();

    return (
        <div  style={{marginBottom: '1em'}}>
            {  state === LotteryStates.BUY_TICKETS_OPEN &&
                <div>
                    <Title style={{marginTop: '2em'}}>⏳</Title>
                    <Title>Approx. time left to buy tickets</Title>
                    <Title2>{stateDeadlineTime}</Title2>
                    <Title2>({stateDeadlineBlocks} blocks)</Title2>
                </div>
            }
            {  state === LotteryStates.BUY_TICKETS_CLOSE &&
            <div>
                <Title style={{marginTop: '2em'}}>⏳</Title>
                <Title>Approx. time before winners announcement</Title>
                <Title2>{stateDeadlineTime}</Title2>
                <Title2>({stateDeadlineBlocks} blocks)</Title2>
            </div>
            }
            {  state === LotteryStates.WINNERS_ANNOUNCED &&
            <div>
                <Title style={{marginTop: '2em'}}>⏳</Title>
                <Title>Approx. time before next lottery start</Title>
                <Title2>{stateDeadlineTime}</Title2>
                <Title2>({stateDeadlineBlocks} blocks)</Title2>
            </div>
            }
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
