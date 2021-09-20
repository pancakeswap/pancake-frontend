import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading, Skeleton, Image } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
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
  margin-top: 32px;
  padding: 32px;
  box-shadow: 0px 10px 30px 0px #008800;
`

const Equipo = () => {
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
        La banda del Tianguis
      </h1>
      <Text color="yellow">Chanclas - dev borracho</Text>
      <Text color="yellow">Chacharas - diseñador distroy </Text>
      <Text color="yellow">El Vato - administrador pinche ñero</Text>
      <Text color="yellow">Ropitas de paca - marketing y bien chismoso</Text>
      <Text color="yellow">Gomi Chela - dev cholear es mi pasión</Text>
    </StyledContainer>
  )
}

export default Equipo
