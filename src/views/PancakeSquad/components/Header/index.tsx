import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Button, Flex, Progress, Text, useModal } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { useNftSaleContract, usePancakeSquadContract, useProfile } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useTokenBalance from 'hooks/useTokenBalance'
import tokens from 'config/constants/tokens'
import { getUserStatus } from 'views/PancakeSquad/utils'
import { getBalanceAmount } from 'utils/formatBalance'
import HeaderBottomWave from '../../assets/HeaderBottomWave'
import BuyTicketsModal from '../Modals/BuyTickets'
import ConfirmModal from '../Modals/Confirm'
import EnableModal from '../Modals/Enable'
import {
  StyledHeaderWaveContainer,
  StyledSquadEventBorder,
  StyledSquadEventContainer,
  StyledSquadHeaderContainer,
} from './styles'
import { SaleStatusEnum } from '../../types'
import { DynamicSaleInfos, FixedSaleInfos } from './types'
import PreEventText from './PreEventText'
import SaleProgress from './SaleProgress'
import MintText from './MintText'
import CtaButtons from './CtaButtons'
import ReadyText from './ReadyText'

const PancakeSquadHeader: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const nftSaleContract = useNftSaleContract()
  const pancakeSquadContract = usePancakeSquadContract()
  const [fixedSaleInfo, setFixedSaleInfo] = useState<FixedSaleInfos>({
    maxSupply: null,
    maxPerAddress: null,
    pricePerTicket: null,
    startTimestamp: null,
    maxPerTransaction: null,
  })
  const [dynamicSaleInfo, setDynamicSaleInfo] = useState<DynamicSaleInfos>({
    totalTicketsDistributed: null,
    saleStatus: null,
    canClaimForGen0: null,
    numberTicketsForGen0: null,
    numberTicketsUsedForGen0: null,
    numberTicketsOfUser: null,
    ticketsOfUser: null,
    totalSupplyMinted: null,
    numberTokensOfUser: null,
    hasActiveProfile: null,
  })
  const { isInitialized, isLoading, profile } = useProfile()
  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useTokenBalance(tokens.cake.address)
  const userCakeBalance = getBalanceAmount(cakeBalance)
  const { maxPerAddress, maxPerTransaction, maxSupply, pricePerTicket, startTimestamp } = fixedSaleInfo
  const {
    saleStatus,
    totalTicketsDistributed,
    canClaimForGen0,
    hasActiveProfile,
    ticketsOfUser,
    numberTicketsUsedForGen0,
    numberTicketsOfUser,
    numberTicketsForGen0,
    totalSupplyMinted,
    numberTokensOfUser,
  } = dynamicSaleInfo
  const userStatus = getUserStatus({ account, hasActiveProfile, canClaimForGen0 })

  useEffect(() => {
    const fetchFixedSaleInfo = async () => {
      const currentMaxSupply = await nftSaleContract.maxSupply()
      const currentMaxPerAddress = await nftSaleContract.maxPerAddress()
      const currentPricePerTicket = await nftSaleContract.pricePerTicket()
      const currentStartTimestamp = await nftSaleContract.startTimestamp()
      const cuurentMaxPerTransaction = await nftSaleContract.maxPerTransaction()
      setFixedSaleInfo({
        maxSupply: currentMaxSupply,
        maxPerAddress: currentMaxPerAddress,
        pricePerTicket: currentPricePerTicket,
        startTimestamp: currentStartTimestamp,
        maxPerTransaction: cuurentMaxPerTransaction,
      })
    }
    const fetchDynamicSaleInfo = async () => {
      const currentTotalTicketsDistributed = await nftSaleContract.totalTicketsDistributed()
      const currentSaleStatus = (await nftSaleContract.currentStatus()) as SaleStatusEnum
      const currentCanClaimForGen0 = await nftSaleContract.canClaimForGen0(account)
      const currentNumberTicketsForGen0 = await nftSaleContract.numberTicketsForGen0(account)
      const currentNumberTicketsUsedForGen0 = await nftSaleContract.numberTicketsUsedForGen0(account)
      const currentNumberTicketsOfUser = await nftSaleContract.viewNumberTicketsOfUser(account)
      const currentTicketsOfUser = await nftSaleContract.ticketsOfUserBySize(account, 0, 600)
      const currentTotalSupplyMinted = await pancakeSquadContract.totalSupply()
      const currentNumberTokensOfUser = await pancakeSquadContract.balanceOf(account)
      const currentHasActiveProfile = await pancakeSquadContract.getUserStatus(account)
      setDynamicSaleInfo({
        totalTicketsDistributed: currentTotalTicketsDistributed,
        saleStatus: currentSaleStatus,
        canClaimForGen0: currentCanClaimForGen0,
        numberTicketsForGen0: currentNumberTicketsForGen0,
        numberTicketsUsedForGen0: currentNumberTicketsUsedForGen0,
        numberTicketsOfUser: currentNumberTicketsOfUser,
        ticketsOfUser: currentTicketsOfUser,
        totalSupplyMinted: currentTotalSupplyMinted,
        numberTokensOfUser: currentNumberTokensOfUser,
        hasActiveProfile: currentHasActiveProfile,
      })
    }
  }, [nftSaleContract, pancakeSquadContract, account])

  return (
    <StyledSquadHeaderContainer flexDirection="column" alignItems="center">
      <Text fontSize="64px" my="32px" color="invertedContrast" bold>
        {t('Pancake Squad')}
      </Text>
      <Text color="warning" bold>
        {t('Mint Cost: 5 CAKE each')}
      </Text>
      <Text color="invertedContrast" mb="32px">
        {t('PancakeSwap’s first official generative NFT collection. Join the squad.')}
      </Text>
      <StyledSquadEventBorder mb="56px">
        <StyledSquadEventContainer m="1px" p="32px">
          <Flex>
            <Flex flexDirection="column">
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
              />
              <ReadyText t={t} userStatus={userStatus} saleStatus={saleStatus} />
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
