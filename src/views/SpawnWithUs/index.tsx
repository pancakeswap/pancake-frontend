import React,{useEffect} from 'react'
import Header from "components/Landing/Header"
import { createWidget } from '@typeform/embed'
import '@typeform/embed/build/css/widget.css'
import styled from 'styled-components'

const FormContainer = styled.div`
    height: 100vh;
`

const SpawnWithUs:React.FC = () => {
    useEffect(() => {
        createWidget("NKBnt4YK",{container: document.querySelector("#spawningForm")})
    })
    return (
        <>
        <Header/>
        <FormContainer id="spawningForm"/>
        </>
    )
}

export default SpawnWithUs