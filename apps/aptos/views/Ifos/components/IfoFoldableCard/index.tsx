import { Box, Card, CardBody, CardHeader, ExpandableButton, useMatchBreakpoints } from '@pancakeswap/uikit'
import NoSSR from 'components/NoSSR'
import { Ifo, PoolIds } from 'config/constants/types'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { getStatus } from 'views/Ifos/hooks/helpers'
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
  const { isMobile } = useMatchBreakpoints()

  const { startTime, endTime } = publicIfoData

  const currentTime = Date.now() / 1000

  const status = getStatus(currentTime, startTime, endTime)

  const shouldShowBunny = status === 'live' || status === 'coming_soon'

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
          <IfoRibbon publicIfoData={publicIfoData} releaseTime={ifo.releaseTime} />
          {shouldShowBunny && <NoHatBunny isLive={status === 'live'} />}
        </Box>
      )}
      <Box position="relative" width="100%" maxWidth={['400px', '400px', '400px', '400px', '400px', '100%']}>
        {!isMobile && shouldShowBunny && <NoHatBunny isCurrent isLive={status === 'live'} />}
        <StyledCard $isCurrent>
          {!isMobile && (
            <>
              <Header $isCurrent ifoId={ifo.id} />
              <NoSSR>
                <IfoRibbon publicIfoData={publicIfoData} releaseTime={ifo.releaseTime} />
              </NoSSR>
            </>
          )}
          <NoSSR>
            <IfoCard ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
          </NoSSR>
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
              <IfoRibbon publicIfoData={publicIfoData} releaseTime={ifo.releaseTime} />
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
  return (
    <>
      <StyledCardBody>
        <CardsWrapper
          shouldReverse={ifo.version >= 3.1}
          // singleCard={!publicIfoData.poolBasic || !walletIfoData.poolBasic}
          singleCard
        >
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
