import React from 'react'
import { Box, Flex, Spinner, Text, Timeline } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useProfile } from 'hooks/useContract'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import useTheme from 'hooks/useTheme'
import { getUserStatus } from 'views/PancakeSquad/utils'
import HeaderBottomWave from '../../assets/HeaderBottomWave'
import nftSaleConfigBuilder from '../../config'
import CtaButtons from './CtaButtons'
import MintText from './MintText'
import PreEventText from './PreEventText'
import SaleProgress from './SaleProgress'
import {
  StyledHeaderWaveContainer,
  StyledSquadEventBorder,
  StyledSquadEventContainer,
  StyledSquadHeaderContainer,
} from './styles'
import { PancakeSquadHeaderType } from './types'

const PancakeSquadHeader: React.FC<PancakeSquadHeaderType> = ({
  dynamicSaleInfo,
  fixedSaleInfo,
  account,
  isLoading,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { profile } = useProfile()
  const { balance: cakeBalance } = useGetCakeBalance()
  const { maxPerAddress, maxPerTransaction, maxSupply, pricePerTicket } = fixedSaleInfo || {}
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
  } = dynamicSaleInfo || {}
  const userStatus = getUserStatus({
    account,
    hasActiveProfile: true,
    hasGen0: canClaimForGen0 || numberTicketsUsedForGen0 > 0,
  })

  return (
    <StyledSquadHeaderContainer flexDirection="column" alignItems="center">
      <Text fontSize="64px" my="32px" color="invertedContrast" bold textAlign="center">
        {t('Pancake Squad')}
      </Text>
      <Text color="warning" textAlign="center" bold>
        {t('Mint Cost: 5 CAKE each')}
        <br />
        {t('Max per wallet: 20')}
      </Text>
      <Text color="invertedContrast" mb="32px" textAlign="center">
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
      <StyledHeaderWaveContainer>
        <HeaderBottomWave />
      </StyledHeaderWaveContainer>
    </StyledSquadHeaderContainer>
  )
}

export default PancakeSquadHeader
