import React from 'react'
import styled from 'styled-components'
import ZombieLogo from "../../../../images/BasicZombie.png"

const AvatarWrapper = styled.div<{ bg: string }>`
  background: url('${({ bg }) => bg}');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 100px;
  height: 100px;
  margin: 20px;
  & > img {
    border-radius: 50%;
  }
`
const Avatar:React.FC = () => {
    return (
        <AvatarWrapper bg={ZombieLogo}/>
    )
}

export default Avatar