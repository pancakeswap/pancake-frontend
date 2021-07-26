import React from 'react'
import { Grave } from 'redux/types'
import {Text} from "@rug-zombie-libs/uikit"
import styled from 'styled-components'

export type CurrentGravesProps = {
    grave:Grave
}

const Container = styled.div`
    padding: 10px;
`
const CurrentGraves:React.FC<CurrentGravesProps> = (props) => {
    const {grave} = props
    const link = `https://app.euler.tools/token/${ grave.name==="RugZombie Common"? '0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5' : grave.rug.address[56]}`
    return (
        <Container>
            <a href={link} target="_blank" rel="noreferrer">
                <Text fontSize="30px" color="green" textAlign="center">
                    {grave.name}
                </Text>
            </a>
        </Container>
    )
}

export default CurrentGraves