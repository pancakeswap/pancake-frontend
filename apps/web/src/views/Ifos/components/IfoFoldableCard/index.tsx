import { useIsWindowVisible } from '@pancakeswap/hooks'
import { Ifo, PoolIds } from '@pancakeswap/ifos'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ExpandableButton,
  ExpandableLabel,
  useMatchBreakpoints,
  useToast,
} from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import { FAST_INTERVAL } from 'config/constants'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { styled } from 'styled-components'
import { requiresApproval } from 'utils/requiresApproval'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useAccount } from 'wagmi'
import { getBannerUrl } from '../../helpers'
import useIfoApprove from '../../hooks/useIfoApprove'
import { CardsWrapper } from '../IfoCardStyles'
import IfoAchievement from './Achievement'
import IfoPoolCard from './IfoPoolCard'
import { IfoRibbon } from './IfoRibbon'
import { EnableStatus } from './types'

interface IfoFoldableCardProps {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const StyledCard = styled(Card)<{ $isCurrent?: boolean }>`
  width: 100%;
  margin: auto;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;

  ${({ $isCurrent }) =>
    $isCurrent &&
    `
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  `}

  > div {
    background: ${({ theme, $isCurrent }) => ($isCurrent ? theme.colors.gradientBubblegum : theme.colors.dropdown)};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;

    > div {
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
    }
  }
`

const Header = styled(CardHeader)<{ ifoId: string; $isCurrent?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: ${({ $isCurrent }) => ($isCurrent ? '64px' : '112px')};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: ${({ ifoId }) => `url('${getBannerUrl(ifoId)}')`};
  ${({ theme }) => theme.mediaQueries.md} {
    height: 112px;
  }
`

export const StyledCardBody = styled(CardBody)`
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

// Active Ifo
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
  const { isMobile } = useMatchBreakpoints()

  return (
    <>
      {isMobile && (
        <Box
          className="sticky-header"
          position="sticky"
          bottom="48px"
          width="100%"
          zIndex={6}
          maxWidth={['400px', '400px', '400px', '100%']}
        >
          <Header $isCurrent ifoId={ifo.id} />
          <IfoRibbon ifoId={ifo.id} publicIfoData={publicIfoData} ifoChainId={ifo.chainId} />
        </Box>
      )}
      <Box position="relative" width="100%" maxWidth={['400px', '400px', '400px', '400px', '400px', '100%']}>
        <StyledCard $isCurrent>
          {!isMobile && (
            <>
              <Header $isCurrent ifoId={ifo.id} />
              <IfoRibbon ifoId={ifo.id} publicIfoData={publicIfoData} ifoChainId={ifo.chainId} />
            </>
          )}
          <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
          <StyledCardFooter>
            <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('Hide') : t('Details')}
            </ExpandableLabel>
            {isExpanded && <IfoAchievement ifo={ifo} publicIfoData={publicIfoData} />}
          </StyledCardFooter>
        </StyledCard>
      </Box>
    </>
  )
}

const FoldableContent = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

// Past Ifo
const IfoFoldableCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  const { asPath } = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const wrapperEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hash = asPath.split('#')[1]
    if (hash === ifo.id) {
      setIsExpanded(true)
      wrapperEl?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [asPath, ifo])

  return (
    <Box id={ifo.id} ref={wrapperEl} position="relative">
      <Box as={StyledCard} borderRadius="32px">
        <Box position="relative">
          <Header ifoId={ifo.id}>
            <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
          </Header>
          {isExpanded && (
            <>
              <IfoRibbon ifoId={ifo.id} publicIfoData={publicIfoData} ifoChainId={ifo.chainId} />
            </>
          )}
        </Box>
        <FoldableContent isVisible={isExpanded}>
          <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
          <IfoAchievement ifo={ifo} publicIfoData={publicIfoData} />
        </FoldableContent>
      </Box>
    </Box>
  )
}

const IfoCard: React.FC<React.PropsWithChildren<IfoFoldableCardProps>> = ({ ifo, publicIfoData, walletIfoData }) => {
  const currentBlock = useCurrentBlock()
  const { fetchIfoData: fetchPublicIfoData, isInitialized: isPublicIfoDataInitialized, secondsUntilEnd } = publicIfoData
  const {
    contract,
    fetchIfoData: fetchWalletIfoData,
    resetIfoData: resetWalletIfoData,
    isInitialized: isWalletDataInitialized,
  } = walletIfoData
  const [enableStatus, setEnableStatus] = useState(EnableStatus.DISABLED)
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const raisingTokenContract = useERC20(ifo.currency.address)
  // Continue to fetch 2 more minutes / is vesting need get latest data
  const isRecentlyActive =
    (publicIfoData.status !== 'finished' ||
      (publicIfoData.status === 'finished' && secondsUntilEnd >= -120) ||
      (publicIfoData.status === 'finished' &&
        ifo.version >= 3.2 &&
        ((publicIfoData[PoolIds.poolBasic]?.vestingInformation?.percentage ?? 0) > 0 ||
          (publicIfoData[PoolIds.poolUnlimited]?.vestingInformation?.percentage ?? 0) > 0))) &&
    ifo.isActive
  const onApprove = useIfoApprove(ifo, contract?.address)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const isWindowVisible = useIsWindowVisible()

  const hasVesting = useMemo(() => {
    return (
      account &&
      ifo.version >= 3.2 &&
      publicIfoData.status === 'finished' &&
      ((publicIfoData[PoolIds.poolBasic]?.vestingInformation?.percentage ?? 0) > 0 ||
        (publicIfoData[PoolIds.poolUnlimited]?.vestingInformation?.percentage ?? 0) > 0) &&
      (walletIfoData[PoolIds.poolBasic]?.amountTokenCommittedInLP.gt(0) ||
        walletIfoData[PoolIds.poolUnlimited].amountTokenCommittedInLP.gt(0))
    )
  }, [account, ifo, publicIfoData, walletIfoData])

  useQuery({
    queryKey: ['fetchPublicIfoData', currentBlock, ifo.id],
    queryFn: async () => fetchPublicIfoData(currentBlock),
    enabled: Boolean(currentBlock && (isRecentlyActive || !isPublicIfoDataInitialized)),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  useQuery({
    queryKey: ['fetchWalletIfoData', account, ifo.id],
    queryFn: async () => fetchWalletIfoData(),
    enabled: Boolean(isWindowVisible && (isRecentlyActive || !isWalletDataInitialized || hasVesting) && account),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,

    ...((isRecentlyActive || hasVesting) && {
      refetchInterval: FAST_INTERVAL,
    }),
  })

  useEffect(() => {
    if (!account && isWalletDataInitialized) {
      resetWalletIfoData()
    }
  }, [account, isWalletDataInitialized, resetWalletIfoData])

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      setEnableStatus(EnableStatus.IS_ENABLING)
      return onApprove() as any
    })
    if (receipt?.status) {
      toastSuccess(
        t('Successfully Enabled!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now participate in the %symbol% IFO.', { symbol: ifo.token.symbol })}
        </ToastDescriptionWithTx>,
      )
      setEnableStatus(EnableStatus.ENABLED)
    } else {
      setEnableStatus(EnableStatus.DISABLED)
    }
  }

  useEffect(() => {
    const checkAllowance = async () => {
      const approvalRequired = await requiresApproval(raisingTokenContract, account || '0x', contract?.address || '0x')
      setEnableStatus(approvalRequired ? EnableStatus.DISABLED : EnableStatus.ENABLED)
    }

    if (account) {
      checkAllowance()
    }
  }, [account, raisingTokenContract, contract, setEnableStatus])

  const hasPoolBasic = Boolean(publicIfoData.poolBasic?.distributionRatio)
  const hasPoolUnlimited = Boolean(publicIfoData.poolUnlimited?.distributionRatio)
  const isSingleCard = publicIfoData.isInitialized && (!hasPoolBasic || !hasPoolUnlimited)

  return (
    <>
      <StyledCardBody>
        <CardsWrapper
          $shouldReverse={ifo.version >= 3.1 && publicIfoData.poolBasic?.saleType !== 2}
          $singleCard={isSingleCard}
        >
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
