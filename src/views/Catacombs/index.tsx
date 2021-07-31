import React from 'react'
import styled from "styled-components"
import CatacombsSVG from '../../images/catacombs.svg'

const Container = styled.div`
    display: flex;
    justify-content: center;
`
const Catacombs:React.FC = () => {
    return (
        <Container>
        <img  src={CatacombsSVG} alt="catacombs-rug-zombie"/>
        </Container>
    )
}

export default Catacombs