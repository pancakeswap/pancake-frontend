import React from 'react'
import { Box, Flex, lightColors, Spinner, Text, Timeline } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import useTheme from 'hooks/useTheme'
import { StyledWaveContainer } from 'views/PancakeSquad/styles'
import { formatBigNumber } from 'utils/formatBalance'
import HeaderBottomWave from '../../assets/HeaderBottomWave'
import nftSaleConfigBuilder from '../../config'
import CtaButtons from './CtaButtons'
import MintText from './MintText'
import PreEventText from './PreEventText'
import SaleProgress from './SaleProgress'
import { StyledSquadEventBorder, StyledSquadEventContainer, StyledSquadHeaderContainer } from './styles'
import { PancakeSquadHeaderType } from './types'

const DEFAULT_CAKE_COST = 5
const DEFAULT_MAX_TICKETS = 20

const PancakeSquadHeader: React.FC<PancakeSquadHeaderType> = ({
  dynamicSaleInfo = {},
  fixedSaleInfo = {},
  account,
  userStatus,
  isLoading,
}) => {
  const { t } = useTranslation()
  const { theme, isDark } = useTheme()
  const { balance: cakeBalance } = useGetCakeBalance()
  const { maxPerAddress, maxPerTransaction, maxSupply, pricePerTicket } = fixedSaleInfo
  const {
    saleStatus,
    totalTicketsDistributed,
    canClaimForGen0,
    ticketsOfUser,
    numberTicketsUsedForGen0,
    numberTicketsOfUser,
    numberTicketsForGen0,
    totalSupplyMinted,
    numberTokensOfUser,
    startTimestamp,
  } = dynamicSaleInfo

  return (
    <StyledSquadHeaderContainer flexDirection="column" alignItems="center">
      <Text fontSize="64px" my="32px" color={lightColors.invertedContrast} bold textAlign="center">
        {t('Pancake Squad')}
      </Text>
      <Text color={lightColors.warning} textAlign="center" bold>
        {t('Mint Cost: %minCost% CAKE each', {
          minCost: pricePerTicket ? formatBigNumber(pricePerTicket, 0) : DEFAULT_CAKE_COST,
        })}
        <br />
        {t('Max per wallet: %maxPerWallet%', { maxPerWallet: maxPerAddress ?? DEFAULT_MAX_TICKETS })}
      </Text>
      <Text color={lightColors.invertedContrast} mb="32px" textAlign="center">
        {t('PancakeSwap’s first official generative NFT collection.')}
        <br />
        {t('Join the squad.')}
      </Text>
      <StyledSquadEventBorder mb="56px">
        <StyledSquadEventContainer m="1px" p="32px">
          <Flex flexDirection={['column', null, 'row']}>
            <Box mr="100px">
              <Timeline events={nftSaleConfigBuilder({ t, saleStatus, startTimestamp })} />
            </Box>
            <Flex flexDirection="column">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <PreEventText t={t} userStatus={userStatus} saleStatus={saleStatus} />
                  <SaleProgress
                    t={t}
                    userStatus={userStatus}
                    saleStatus={saleStatus}
                    totalTicketsDistributed={totalTicketsDistributed}
                    maxSupply={maxSupply}
                    totalSupplyMinted={totalSupplyMinted}
                  />
                  <MintText
                    t={t}
                    userStatus={userStatus}
                    saleStatus={saleStatus}
                    numberTicketsOfUser={numberTicketsOfUser}
                    numberTokensOfUser={numberTokensOfUser}
                  />
                  <CtaButtons
                    t={t}
                    account={account}
                    theme={theme}
                    userStatus={userStatus}
                    saleStatus={saleStatus}
                    numberTokensOfUser={numberTokensOfUser}
                    canClaimForGen0={canClaimForGen0}
                    maxPerAddress={maxPerAddress}
                    maxSupply={maxSupply}
                    numberTicketsOfUser={numberTicketsOfUser}
                    numberTicketsUsedForGen0={numberTicketsUsedForGen0}
                    totalSupplyMinted={totalSupplyMinted}
                    cakeBalance={cakeBalance}
                    maxPerTransaction={maxPerTransaction}
                    numberTicketsForGen0={numberTicketsForGen0}
                    pricePerTicket={pricePerTicket}
                    ticketsOfUser={ticketsOfUser}
                  />
                </>
              )}
            </Flex>
          </Flex>
        </StyledSquadEventContainer>
      </StyledSquadEventBorder>
      <StyledWaveContainer bottom="-2px">
        <HeaderBottomWave isDark={isDark} />
      </StyledWaveContainer>
    </StyledSquadHeaderContainer>
  )
}

export default PancakeSquadHeader
