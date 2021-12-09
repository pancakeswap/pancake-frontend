import React, { useEffect, useState } from 'react'
import { useBlock } from 'state/block/hooks'
import styled from 'styled-components'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardRibbon,
  ExpandableButton,
  Progress,
  Button,
  ChevronUpIcon,
  Box,
  Heading,
  Flex,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Ifo, IfoStatus, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import useRefresh from 'hooks/useRefresh'
import { useTranslation } from 'contexts/Localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { EnableStatus } from './IfoFoldableCard/types'
import IfoPoolCard from './IfoFoldableCard/IfoPoolCard'
import Timer from './IfoFoldableCard/Timer'
import Achievement from './IfoFoldableCard/Achievement'
import useIfoApprove from '../hooks/useIfoApprove'
import useIsWindowVisible from '../../../hooks/useIsWindowVisible'
import { IfoRibbon } from './IfoRibbon'

const StyledProgress = styled(Progress)`
  background-color: none;
  div {
    background-color: none;
    background: linear-gradient(273deg, #ffd800 -2.87%, #eb8c00 113.73%);
  }
`

interface IfoFoldableCardProps {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isInitiallyVisible: boolean
  foldable?: boolean
}

const StyledCard = styled(Card)`
  max-width: 705px;
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

const FoldableContent = styled.div<{ isVisible: boolean; isActive: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  /* background: ${({ isActive, theme }) => (isActive ? theme.colors.gradients.bubblegum : theme.colors.dropdown)}; */
`

const CardsWrapper = styled.div<{ singleCard: boolean }>`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  ${({ theme }) => theme.mediaQueries.md} {
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
  text-align: center;
  padding: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const IfoCurrentCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  return (
    <StyledCard>
      <Header ifoId={ifo.id} />
      <IfoStakeFoldableCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
    </StyledCard>
  )
}

const IfoStakeFoldableCard: React.FC<IfoFoldableCardProps> = ({ ifo, publicIfoData, walletIfoData }) => {
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
  const isActive = publicIfoData.status !== 'finished' && ifo.isActive
  // Continue to fetch 2 more minutes to get latest data
  const isRecentlyActive =
    (publicIfoData.status !== 'finished' || (publicIfoData.status === 'finished' && secondsUntilEnd >= -120)) &&
    ifo.isActive
  const onApprove = useIfoApprove(raisingTokenContract, contract.address)
  const { toastSuccess } = useToast()
  const { fastRefresh } = useRefresh()
  const isWindowVisible = useIsWindowVisible()

  // useEffect(() => {
  //   if (isVisible && (isRecentlyActive || !isPublicIfoDataInitialized)) {
  //     fetchPublicIfoData(currentBlock)
  //   }
  // }, [isVisible, isRecentlyActive, isPublicIfoDataInitialized, fetchPublicIfoData, currentBlock])

  // useEffect(() => {
  //   if (isWindowVisible && isVisible && (isRecentlyActive || !isWalletDataInitialized)) {
  //     if (account) {
  //       fetchWalletIfoData()
  //     }
  //   }

  //   if (!account && isWalletDataInitialized) {
  //     resetWalletIfoData()
  //   }
  // }, [
  //   isVisible,
  //   isWindowVisible,
  //   account,
  //   isRecentlyActive,
  //   isWalletDataInitialized,
  //   fetchWalletIfoData,
  //   resetWalletIfoData,
  //   fastRefresh,
  // ])

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
      <IfoRibbon ifo={ifo} publicIfoData={publicIfoData} />
      {/* <FoldableContent isVisible={isVisible} isActive={publicIfoData.status !== 'idle' && isActive}> */}
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
        {/* {foldable && (
            <Box mt="32px">
              <Achievement ifo={ifo} publicIfoData={publicIfoData} />
            </Box>
          )} */}
      </StyledCardBody>
      <StyledCardFooter>
        {/* <Button variant="text" endIcon={<ChevronUpIcon color="primary" />} onClick={() => setIsVisible(false)}>
            {t('Close')}
          </Button> */}
      </StyledCardFooter>
    </>
  )
}

export default IfoStakeFoldableCard
