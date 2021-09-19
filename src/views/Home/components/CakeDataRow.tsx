import React from 'react'
import styled from 'styled-components'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getBalanceNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { Flex, Text, Heading, Skeleton, Image } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
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
  box-shadow: 0px 10px 30px 0px #008800;
`

const emissionsPerBlock = 1

const CakeDataRow = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(tokens.morralla.address))
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
  const cakePriceBusd = usePriceCakeBusd()
  const mcap = cakePriceBusd.times(cakeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())

  const morrallalogo = '/images/tianguis/morralla.svg'
  const morrallalogoText = '/images/tianguis/morrallalogo.png'

  return (
    <StyledContainer>
      <Heading>Tokenomics de MORRALLA - el token del Tianguis!</Heading>
      <Grid>
        <Flex flexDirection="column">
          <Image src={morrallalogo} width={1080} height={1467} />
        </Flex>
        <StyledColumn>
          <Text color="textSubtle">{t('Total supply')}</Text>
          {cakeSupply ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={cakeSupply} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
          <Text color="textSubtle">{t('Burned to date')}</Text>
          {burnedBalance ? (
            <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
        </StyledColumn>
        <StyledColumn noMobileBorder>
          <Text color="textSubtle">{t('Market cap')}</Text>
          {mcap?.gt(0) && mcapString ? (
            <Heading scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</Heading>
          ) : (
            <Skeleton height={24} width={126} my="4px" />
          )}
          <Text color="textSubtle">{t('Current emissions')}</Text>
          <Heading scale="lg">{t('%cakeEmissions%/block', { cakeEmissions: emissionsPerBlock })}</Heading>
        </StyledColumn>
      </Grid>
    </StyledContainer>
  )
}

export default CakeDataRow
