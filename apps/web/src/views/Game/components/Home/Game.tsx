// 948px

import React from 'react'
import { styled } from 'styled-components'
import { Flex, Box, Text, Button, CardHeader, Link, Card } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const StyledGameContainer = styled(Flex)<{ isHorizontal?: boolean }>`
  flex-direction: column;
  margin: auto;
  padding-bottom: 82px;
  width: ${({ isHorizontal }) => (isHorizontal ? '1101px' : '948px')};
`
const StyledGameInfoContainer = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const StyledGameInformation = styled(Flex)<{ isHorizontal?: boolean }>`
  padding: 24px;
  margin-left: 32px;
  flex-direction: column;
  width: ${({ isHorizontal }) => (isHorizontal ? '365px' : '467px')};
`

const Header = styled(CardHeader)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 112px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: url('/images/ifos/sable-bg.png');
  ${({ theme }) => theme.mediaQueries.md} {
    height: 112px;
  }
`

const StyledTag = styled(Button)`
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;
  box-shadow: 0px 0px 1px 0px #757575;
  border: ${({ theme }) => `solid 1px ${theme.colors.textSubtle}`};
  color: ${({ theme }) => theme.colors.textSubtle};
  background-color: ${({ theme }) => theme.card.background};
`

const StyledTagContainer = styled(Flex)`
  flex-wrap: wrap;
  ${StyledTag} {
    margin: 8px 4px 0 0;
  }
`

interface GameProps {
  isLatest?: boolean
  isHorizontal?: boolean
}

export const Game: React.FC<React.PropsWithChildren<GameProps>> = ({ isLatest, isHorizontal }) => {
  const { t } = useTranslation()

  return (
    <StyledGameContainer isHorizontal={isHorizontal}>
      {isLatest && (
        <Box mb="32px">
          <Text>LOGO</Text>
          <Flex justifyContent="center">
            <Text as="span" bold fontSize={['40px']} color="secondary">
              Flagship
            </Text>
            <Text as="span" ml="8px" bold fontSize={['40px']}>
              Game
            </Text>
          </Flex>
        </Box>
      )}
      <Card>
        <Header />
        <StyledGameInfoContainer padding="0 32px 32px 32px">
          <Flex width="100%" justifyContent="space-between">
            <Box>123123</Box>
            <StyledGameInformation>
              <Text mb="24px" bold fontSize={['40px']}>
                Pancake Protectors
              </Text>
              <Text mb="24px" bold fontSize={['24px']} color="secondary">
                Unlock the Power of CAKE and Perks for Pancake Squad and Bunnies Holders
              </Text>
              <Text mb="24px" lineHeight="120%">
                PancakeSwap and Mobox joined forces to launch a tower-defense and PvP game tailored for GameFi players,
                as well as CAKE, Pancake Squad, and Bunnies holders.
              </Text>
              <Link width="100% !important" external href="/">
                <Button width="100%">{t('Play Now')}</Button>
              </Link>
              <Box mt="24px">
                <Text>TRENDING TAGS FOR THIS GAME:</Text>
                <StyledTagContainer>
                  <StyledTag scale="sm">PvP</StyledTag>
                  <StyledTag scale="sm">Strategy</StyledTag>
                  <StyledTag scale="sm">Pancake Squad</StyledTag>
                  <StyledTag scale="sm">Pancake Bunnies</StyledTag>
                  <StyledTag scale="sm">Tower Defense</StyledTag>
                </StyledTagContainer>
              </Box>
            </StyledGameInformation>
          </Flex>
        </StyledGameInfoContainer>
      </Card>
    </StyledGameContainer>
  )
}
