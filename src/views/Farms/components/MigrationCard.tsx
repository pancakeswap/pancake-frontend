import React from 'react'
import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Text, Button } from '@pancakeswap/uikit'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: auto;
  padding: 24px 40px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1120px;
  }

  border-bottom: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-left: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-right: 1px ${({ theme }) => theme.colors.secondary} solid;
  border-radius: ${({ theme }) => `0 0 ${theme.radii.card} ${theme.radii.card}`};
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(360deg, rgba(49, 61, 92, 0.9) 0%, rgba(61, 42, 84, 0.9) 100%)'
      : 'linear-gradient(180deg, rgba(202, 194, 236, 0.9) 0%,  rgba(204, 220, 239, 0.9) 51.04%, rgba(206, 236, 243, 0.9) 100%)'};
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const MigrationCard: React.FC = () => {
  return (
    <Container>
      <TextGroup>
        <Text fontSize="40px" bold>
          MasterChef v2 Migration
        </Text>
        <Text>You need to migrate in order to continue receving staking rewards.</Text>
      </TextGroup>
      <NextLinkFromReactRouter to="/migration">
        <Button width="266px">Proceed</Button>
      </NextLinkFromReactRouter>
    </Container>
  )
}

export default MigrationCard
