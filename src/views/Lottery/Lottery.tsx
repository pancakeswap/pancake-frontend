import React, {useEffect} from 'react'
import styled from 'styled-components'


const Farm: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // return (
    //     <Switch>
    //         <Page>
    //             <Title style={{marginTop: '0.5em'}}>
    //                 💰
    //                 <br/>
    //                 WIN
    //             </Title>
    //             <Title2>{lotteryPrizeAmount} CAKE</Title2>
    //             <Subtitle>{subtitleText}</Subtitle>
    //             <StyledFarm>
    //                 <StyledCardWrapper>
    //                     <Prize/>
    //                     <Ticket/>
    //                 </StyledCardWrapper>
    //             </StyledFarm>
    //             <Time></Time>
    //             <Winning></Winning>
    //         </Page>
    //     </Switch>
    // )

    return (
        <StyledFarm>
            <div>
                |-----------------|<br/>
                | COMING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                | SOON&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                |-----------------|<br/>
                (\__/) ||<br/>
                (•ㅅ•) ||<br/>
                / 　 づ<br/>

            </div>
        </StyledFarm>
    )

}

const StyledFarm = styled.div`
  margin-top: 2.5em;      
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

export default Farm
