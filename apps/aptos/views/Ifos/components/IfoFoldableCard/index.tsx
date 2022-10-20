import { useAccount } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ExpandableButton,
  useMatchBreakpoints,
  useToast,
} from '@pancakeswap/uikit'
import { Ifo, PoolIds } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
// import { useERC20 } from 'hooks/useContract'
import { useIsWindowVisible } from '@pancakeswap/hooks'
import useSWRImmutable from 'swr/immutable'
import { FAST_INTERVAL } from 'config/constants'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
// import { useCurrentBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { CardsWrapper } from '../IfoCardStyles'
import IfoPoolCard from './IfoPoolCard'
import { IfoRibbon } from './IfoRibbon'

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
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.png')`};
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

const StyledNoHatBunny = styled.div<{ $isLive: boolean; $isCurrent?: boolean }>`
  position: absolute;
  left: -24px;
  z-index: 1;
  top: 33px;
  display: none;

  > img {
    width: 78px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
    left: auto;
    top: ${({ $isLive }) => ($isLive ? '63px' : '48px')};
    right: ${({ $isCurrent }) => ($isCurrent ? '17px' : '90px')};

    > img {
      width: 123px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 90px;
  }
`

const NoHatBunny = ({ isLive, isCurrent }: { isLive?: boolean; isCurrent?: boolean }) => {
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const isSmallerThanTablet = isXs || isSm || isMd
  if (isSmallerThanTablet && isLive) return null
  return (
    <StyledNoHatBunny $isLive={!!isLive} $isCurrent={isCurrent}>
      <img
        src={`/images/ifos/assets/bunnypop-${!isSmallerThanTablet ? 'right' : 'left'}.png`}
        width={123}
        height={162}
        alt="bunny"
      />
    </StyledNoHatBunny>
  )
}

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
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const shouldShowBunny = publicIfoData.status === 'live' || publicIfoData.status === 'coming_soon'

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
          <IfoRibbon publicIfoData={publicIfoData} />
          {shouldShowBunny && <NoHatBunny isLive={publicIfoData.status === 'live'} />}
        </Box>
      )}
      <Box position="relative" width="100%" maxWidth={['400px', '400px', '400px', '400px', '400px', '100%']}>
        {!isMobile && shouldShowBunny && <NoHatBunny isCurrent isLive={publicIfoData.status === 'live'} />}
        <StyledCard $isCurrent>
          {!isMobile && (
            <>
              <Header $isCurrent ifoId={ifo.id} />
              <IfoRibbon publicIfoData={publicIfoData} />
            </>
          )}
          <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
        </StyledCard>
      </Box>
    </>
  )
}

const FoldableContent = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

// Past Ifo
export const IfoFoldableCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  const { asPath } = useRouter()
  const { isDesktop } = useMatchBreakpoints()
  const [isExpanded, setIsExpanded] = useState(false)
  const wrapperEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hash = asPath.split('#')[1]
    if (hash === ifo.id) {
      setIsExpanded(true)
      wrapperEl.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [asPath, ifo])

  return (
    <Box id={ifo.id} ref={wrapperEl} position="relative">
      {isExpanded && isDesktop && <NoHatBunny isLive={false} />}
      <Box as={StyledCard} borderRadius="32px">
        <Box position="relative">
          <Header ifoId={ifo.id}>
            <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
          </Header>
          {isExpanded && (
            <>
              <IfoRibbon publicIfoData={publicIfoData} />
            </>
          )}
        </Box>
        <FoldableContent isVisible={isExpanded}>
          <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
        </FoldableContent>
      </Box>
    </Box>
  )
}

const IfoCard: React.FC<React.PropsWithChildren<IfoFoldableCardProps>> = ({ ifo, publicIfoData, walletIfoData }) => {
  // const currentBlock = useCurrentBlock()
  const currentBlock = 1
  const { fetchIfoData: fetchPublicIfoData, isInitialized: isPublicIfoDataInitialized, secondsUntilEnd } = publicIfoData
  const {
    contract,
    fetchIfoData: fetchWalletIfoData,
    resetIfoData: resetWalletIfoData,
    isInitialized: isWalletDataInitialized,
  } = walletIfoData
  const { t } = useTranslation()
  const { account } = useAccount()
  // const raisingTokenContract = useERC20(ifo.currency.address, false)
  // Continue to fetch 2 more minutes / is vesting need get latest data
  const isRecentlyActive =
    (publicIfoData.status !== 'finished' ||
      (publicIfoData.status === 'finished' && secondsUntilEnd >= -120) ||
      (publicIfoData.status === 'finished' &&
        ifo.version >= 3.2 &&
        ((publicIfoData[PoolIds.poolBasic]?.vestingInformation?.percentage ?? -1) > 0 ||
          (publicIfoData[PoolIds.poolUnlimited].vestingInformation?.percentage ?? -1) > 0))) &&
    ifo.isActive
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const isWindowVisible = useIsWindowVisible()

  useSWRImmutable(
    (isRecentlyActive || !isPublicIfoDataInitialized) && currentBlock && ['fetchPublicIfoData', currentBlock],
    async () => {
      fetchPublicIfoData(currentBlock)
    },
  )

  useSWRImmutable(
    isWindowVisible && (isRecentlyActive || !isWalletDataInitialized) && account && 'fetchWalletIfoData',
    async () => {
      fetchWalletIfoData()
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useEffect(() => {
    if (!account && isWalletDataInitialized) {
      resetWalletIfoData()
    }
  }, [account, isWalletDataInitialized, resetWalletIfoData])

  return (
    <>
      <StyledCardBody>
        <CardsWrapper
          shouldReverse={ifo.version >= 3.1}
          // singleCard={!publicIfoData.poolBasic || !walletIfoData.poolBasic}
          singleCard
        >
          {/* {publicIfoData.poolBasic && walletIfoData.poolBasic && (
            <IfoPoolCard
              poolId={PoolIds.poolBasic}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              onApprove={handleApprove}
              enableStatus={enableStatus}
            />
          )} */}
          <IfoPoolCard
            poolId={PoolIds.poolUnlimited}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
          />
        </CardsWrapper>
      </StyledCardBody>
    </>
  )
}
