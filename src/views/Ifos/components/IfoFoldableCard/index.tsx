import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ExpandableLabel,
  ExpandableButton,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Ifo, PoolIds } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import useRefresh from 'hooks/useRefresh'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import { useBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useIsWindowVisible from '../../../../hooks/useIsWindowVisible'
import useIfoApprove from '../../hooks/useIfoApprove'
import IfoAchievement from './Achievement'
import IfoPoolCard from './IfoPoolCard'
import { EnableStatus } from './types'
import { IfoRibbon } from './IfoRibbon'

interface IfoFoldableCardProps {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const StyledCard = styled(Card)`
  width: 100%;
  margin: auto;

  > div {
    background: ${({ theme }) => theme.colors.gradients.bubblegum};
  }
`

const Header = styled(CardHeader)<{ ifoId: string }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 112px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.svg'), url('/images/ifos/${ifoId}-bg.png')`};
`

const CardsWrapper = styled.div<{ singleCard: boolean }>`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  ${({ theme }) => theme.mediaQueries.xxl} {
    grid-template-columns: ${({ singleCard }) => (singleCard ? '1fr' : '1fr 1fr')};
    justify-items: ${({ singleCard }) => (singleCard ? 'center' : 'unset')};
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 24px 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  padding: 0;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
`

const StyledNoHatBunny = styled.div<{ $isLive: boolean }>`
  position: absolute;
  left: -38px;
  z-index: 1;
  top: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    top: ${({ $isLive }) => ($isLive ? '46px' : '33px')};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    left: auto;
    top: ${({ $isLive }) => ($isLive ? '56px' : '45px')};
    right: 5%;
  }
`

const NoHatBunny = ({ isLive }) => {
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const isSmallerThanTablet = isXs || isSm || isMd
  if (isSmallerThanTablet && isLive) return null
  return (
    <StyledNoHatBunny $isLive={isLive}>
      <img
        src={`/images/ifos/assets/bunnypop-${!isSmallerThanTablet ? 'right' : 'left'}.png`}
        width={123}
        height={162}
        alt="bunny"
      />
    </StyledNoHatBunny>
  )
}

export const IfoCurrentCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()

  return (
    <Box position="relative" width="100%">
      <NoHatBunny isLive={publicIfoData.status === 'live'} />
      <StyledCard>
        <Box position="relative">
          <Header ifoId={ifo.id} />
          <IfoRibbon publicIfoData={publicIfoData} />
        </Box>
        <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
        <StyledCardFooter>
          <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? t('Hide') : t('Details')}
          </ExpandableLabel>
          {isExpanded && <IfoAchievement ifo={ifo} publicIfoData={publicIfoData} />}
        </StyledCardFooter>
      </StyledCard>
    </Box>
  )
}

const FoldableContent = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

const IfoFoldableCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()

  return (
    <Box position="relative">
      {isExpanded && <NoHatBunny isLive={publicIfoData.status === 'live'} />}
      <StyledCard>
        <Box position="relative">
          <Header ifoId={ifo.id}>
            {!isExpanded && <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />}
          </Header>
          {isExpanded && (
            <>
              <IfoRibbon publicIfoData={publicIfoData} />
            </>
          )}
        </Box>
        <FoldableContent isVisible={isExpanded}>
          <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
          <StyledCardFooter>
            <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('Hide') : t('Details')}
            </ExpandableLabel>
            {isExpanded && <IfoAchievement ifo={ifo} publicIfoData={publicIfoData} />}
          </StyledCardFooter>
        </FoldableContent>
      </StyledCard>
    </Box>
  )
}

const IfoCard: React.FC<IfoFoldableCardProps> = ({ ifo, publicIfoData, walletIfoData }) => {
  const { currentBlock } = useBlock()
  const { fetchIfoData: fetchPublicIfoData, isInitialized: isPublicIfoDataInitialized, secondsUntilEnd } = publicIfoData
  const {
    contract,
    fetchIfoData: fetchWalletIfoData,
    resetIfoData: resetWalletIfoData,
    isInitialized: isWalletDataInitialized,
  } = walletIfoData
  const [enableStatus, setEnableStatus] = useState(EnableStatus.DISABLED)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const raisingTokenContract = useERC20(ifo.currency.address)
  // Continue to fetch 2 more minutes to get latest data
  const isRecentlyActive =
    (publicIfoData.status !== 'finished' || (publicIfoData.status === 'finished' && secondsUntilEnd >= -120)) &&
    ifo.isActive
  const onApprove = useIfoApprove(raisingTokenContract, contract.address)
  const { toastSuccess } = useToast()
  const { fastRefresh } = useRefresh()
  const isWindowVisible = useIsWindowVisible()

  useEffect(() => {
    if (isRecentlyActive || !isPublicIfoDataInitialized) {
      fetchPublicIfoData(currentBlock)
    }
  }, [isRecentlyActive, isPublicIfoDataInitialized, fetchPublicIfoData, currentBlock])

  useEffect(() => {
    if (isWindowVisible && (isRecentlyActive || !isWalletDataInitialized)) {
      if (account) {
        fetchWalletIfoData()
      }
    }

    if (!account && isWalletDataInitialized) {
      resetWalletIfoData()
    }
  }, [
    isWindowVisible,
    account,
    isRecentlyActive,
    isWalletDataInitialized,
    fetchWalletIfoData,
    resetWalletIfoData,
    fastRefresh,
  ])

  const handleApprove = async () => {
    try {
      setEnableStatus(EnableStatus.IS_ENABLING)

      const receipt = await onApprove()

      setEnableStatus(EnableStatus.ENABLED)
      toastSuccess(
        t('Successfully Enabled!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now participate in the %symbol% IFO.', { symbol: ifo.token.symbol })}
        </ToastDescriptionWithTx>,
      )
    } catch (error) {
      setEnableStatus(EnableStatus.DISABLED)
    }
  }

  useEffect(() => {
    const checkAllowance = async () => {
      try {
        const response = await raisingTokenContract.allowance(account, contract.address)
        const currentAllowance = new BigNumber(response.toString())
        setEnableStatus(currentAllowance.lte(0) ? EnableStatus.DISABLED : EnableStatus.ENABLED)
      } catch (error) {
        setEnableStatus(EnableStatus.DISABLED)
      }
    }

    if (account) {
      checkAllowance()
    }
  }, [account, raisingTokenContract, contract, setEnableStatus])

  return (
    <>
      <StyledCardBody>
        <CardsWrapper singleCard={!publicIfoData.poolBasic || !walletIfoData.poolBasic}>
          {publicIfoData.poolBasic && walletIfoData.poolBasic && (
            <IfoPoolCard
              poolId={PoolIds.poolBasic}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              onApprove={handleApprove}
              enableStatus={enableStatus}
            />
          )}
          <IfoPoolCard
            poolId={PoolIds.poolUnlimited}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            onApprove={handleApprove}
            enableStatus={enableStatus}
          />
        </CardsWrapper>
      </StyledCardBody>
    </>
  )
}

export default IfoFoldableCard
