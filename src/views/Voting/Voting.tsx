import React, { useEffect } from 'react'
import styled from 'styled-components'




const Farm: React.FC = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // const lpContract = useMemo(() => {
  //   return getContract(ethereum as provider, lpTokenAddress)
  // }, [ethereum, lpTokenAddress])

  // const { onRedeem } = useRedeem(getMasterChefContract(sushi))

  // const lpTokenName = useMemo(() => {
  //   return lpToken.toUpperCase()
  // }, [lpToken])

  // const earnTokenName = useMemo(() => {
  //   return earnToken.toUpperCase()
  // }, [earnToken])

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
  margin-top: 160px;
  text-align: center;
  > div{
    display:  inline-block;
    text-align: left;
  }
`


export default Farm
