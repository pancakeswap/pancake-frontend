import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading, Skeleton, Image } from '@pancakeswap/uikit'
import tokens from 'config/constants/tokens'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const StyledContainer = styled.div`
  border: 2px solid yellow;
  border-radius: 16px;
  padding: 32px;
  margin-top: 32px;
  box-shadow: 0px 10px 30px 0px #008800;
`
const Hecho = styled.div`
  text-decoration: line-through;
`

const emissionsPerBlock = 1

const CakeDataRow = () => {
  return (
    <StyledContainer>
      <h1
        style={{
          margin: '32px',
          fontSize: '3.5em',
          letterSpacing: '-1px',
          color: 'yellow',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        ¿QUÉ SHOW O QUÉ?
      </h1>

      <Hecho>
        <Text color="yellow">1. SACA LA MORRALLA (YA ESTA!)</Text>
        <Text color="yellow">2. ECHAR MICHELADAS, PA{"' "}QUÉ VAS AL TIANGUIS?</Text>
        <Text color="yellow">3. STAKEAR PA GANAR MAS MORRALLA</Text>{' '}
      </Hecho>

      <Text color="yellow">4. MERCHANDISE</Text>
      <Text color="yellow">5. APOYO Y SOLIDARIDAD (A ASOCIACIONES MEXICANOS)</Text>
      <Text color="yellow">6. VAMOS AL CAJERO!</Text>
      <Text color="yellow">7. SONIDERO!</Text>
    </StyledContainer>
  )
}

export default CakeDataRow
