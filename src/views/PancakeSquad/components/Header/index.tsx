import { BigNumber } from '@ethersproject/bignumber'
import { Box, Flex, Spinner, Text, Timeline } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import {
  useNftSaleContract,
  usePancakeSquadContract,
  useProfile,
  useProfile as useProfileContract,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import React, { useEffect, useState } from 'react'
import { getUserStatus } from 'views/PancakeSquad/utils'
import HeaderBottomWave from '../../assets/HeaderBottomWave'
import { SaleStatusEnum } from '../../types'
import CtaButtons from './CtaButtons'
import MintText from './MintText'
import PreEventText from './PreEventText'
import SaleProgress from './SaleProgress'
import nftSaleConfigBuilder from '../../config'
import {
  StyledHeaderWaveContainer,
  StyledSquadEventBorder,
  StyledSquadEventContainer,
  StyledSquadHeaderContainer,
} from './styles'
import { DynamicSaleInfos, FixedSaleInfos } from './types'

const PancakeSquadHeader: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const nftSaleContract = useNftSaleContract()
  const pancakeSquadContract = usePancakeSquadContract()
  const profileContract = useProfileContract()
  const [fixedSaleInfo, setFixedSaleInfo] = useState<FixedSaleInfos | null>(null)
  const [dynamicSaleInfo, setDynamicSaleInfo] = useState<DynamicSaleInfos | null>(null)
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

  useEffect(() => {
    const fetchFixedSaleInfo = async () => {
      try {
        const currentMaxSupply = await nftSaleContract.maxSupply()
        const currentMaxPerAddress = await nftSaleContract.maxPerAddress()
        const currentPricePerTicket = await nftSaleContract.pricePerTicket()
        const curentMaxPerTransaction = await nftSaleContract.maxPerTransaction()
        setFixedSaleInfo({
          maxSupply: currentMaxSupply.toNumber(),
          maxPerAddress: currentMaxPerAddress.toNumber(),
          pricePerTicket: BigNumber.from(currentPricePerTicket),
          maxPerTransaction: curentMaxPerTransaction.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }

    if (!fixedSaleInfo && account && nftSaleContract) fetchFixedSaleInfo()
  }, [nftSaleContract, account, fixedSaleInfo])

  useEffect(() => {
    const fetchDynamicSaleInfo = async () => {
      try {
        const currentTotalTicketsDistributed = await nftSaleContract.totalTicketsDistributed()
        const currentSaleStatus = (await nftSaleContract.currentStatus()) as SaleStatusEnum
        const currentCanClaimForGen0 = await nftSaleContract.canClaimForGen0(account)
        const currentNumberTicketsForGen0 = await nftSaleContract.numberTicketsForGen0(account)
        const currentNumberTicketsUsedForGen0 = await nftSaleContract.numberTicketsUsedForGen0(account)
        const currentNumberTicketsOfUser = await nftSaleContract.viewNumberTicketsOfUser(account)
        const currentTicketsOfUser = await nftSaleContract.ticketsOfUserBySize(account, 0, 600)
        const currentTotalSupplyMinted = await pancakeSquadContract.totalSupply()
        const currentNumberTokensOfUser = await pancakeSquadContract.balanceOf(account)
        const currentStartTimestamp = await nftSaleContract.startTimestamp()
        setDynamicSaleInfo({
          totalTicketsDistributed: currentTotalTicketsDistributed.toNumber(),
          saleStatus: currentSaleStatus,
          canClaimForGen0: currentCanClaimForGen0,
          numberTicketsForGen0: currentNumberTicketsForGen0.toNumber(),
          numberTicketsUsedForGen0: currentNumberTicketsUsedForGen0.toNumber(),
          numberTicketsOfUser: currentNumberTicketsOfUser.toNumber(),
          ticketsOfUser: currentTicketsOfUser,
          totalSupplyMinted: currentTotalSupplyMinted.toNumber(),
          numberTokensOfUser: currentNumberTokensOfUser.toNumber(),
          startTimestamp: currentStartTimestamp.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }
    if (account && nftSaleContract && pancakeSquadContract && profileContract) fetchDynamicSaleInfo()
  }, [nftSaleContract, pancakeSquadContract, profileContract, account])

  useEffect(() => {
    if (fixedSaleInfo != null && dynamicSaleInfo !== null && isLoading) setIsLoading(false)
  }, [fixedSaleInfo, dynamicSaleInfo, isLoading])

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
