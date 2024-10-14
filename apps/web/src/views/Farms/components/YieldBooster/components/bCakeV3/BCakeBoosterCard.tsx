import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  HelpIcon,
  Link,
  RocketIcon,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CrossChainVeCakeModal } from 'components/CrossChainVeCakeModal'
import { SwitchToBnbChainModal } from 'components/CrossChainVeCakeModal/components/SwitchToBnbCahinModal'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import Image from 'next/legacy/image'
import NextLink from 'next/link'
import { useMemo, useState } from 'react'
import { styled, useTheme } from 'styled-components'
import { useAccount } from 'wagmi'
import boosterCardImage from '../../../../images/boosterCardImage.png'
import boosterCardImagePM from '../../../../images/boosterCardImagePM.png'
import { useBCakeBoostLimitAndLockInfo } from '../../hooks/bCakeV3/useBCakeV3Info'

export const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 296px;
    margin-left: 50px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
  }
`
export const ImageWrapper = styled.div`
  position: absolute;
  transform: translateY(-50%) scale(75%);
  right: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    transform: translateY(-50%);
  }
  z-index: 2;
`
const StyledCardBody = styled(CardBody)`
  border-bottom: none;
`
const StyledCardFooter = styled(CardFooter)`
  border-top: none;
  position: relative;
  padding: 8px 24px 16px;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: calc(100% - 48px);
    top: 0px;
    left: 24px;
    background-color: ${({ theme }) => theme.colors.cardBorder};
  }
`

export const useBCakeTooltipContent = () => {
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Box mb="20px">
        {t(
          'Yield Boosters allow you to boost your farming yields by locking CAKE in the veCAKE pool. The more CAKE you lock, and the longer you lock them, the higher the boost you will receive.',
        )}
      </Box>
      <Box>
        {t('To learn more, check out the')}
        <Link external href="https://medium.com/pancakeswap/introducing-bcake-farm-yield-boosters-b27b7a6f0f84">
          {t('Medium Article')}
        </Link>
      </Box>
    </>
  )
  return tooltipContent
}

export const BCakeBoosterCard: React.FC<{ variants?: 'farm' | 'pm' }> = ({ variants = 'farm' }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const tooltipContent = useBCakeTooltipContent()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
    ...(isMobile && { hideTimeout: 1500 }),
  })
  return (
    <CardWrapper>
      <ImageWrapper style={{ left: variants === 'pm' ? -185 : isMobile ? -65 : -70, top: 105 }}>
        <Image
          src={variants === 'pm' ? boosterCardImagePM : boosterCardImage}
          alt="booster-card-image"
          width={variants === 'pm' ? 259 : 99}
          height={variants === 'pm' ? 226 : 191}
          placeholder="blur"
        />
      </ImageWrapper>
      <Card p="0px" style={{ zIndex: 1 }}>
        <StyledCardBody style={{ padding: '15px 24px' }}>
          <RocketIcon />
          <Text fontSize={22} bold color="text" marginBottom="-12px" display="inline-block" ml="7px">
            {t('Yield Booster')}
          </Text>
          {tooltipVisible && tooltip}
          <Box ref={targetRef} style={{ float: 'right', position: 'relative', top: '6px' }}>
            <HelpIcon color={theme.colors.textSubtle} />
          </Box>
        </StyledCardBody>
        <StyledCardFooter>
          <CardContent variants={variants} />
        </StyledCardFooter>
      </Card>
    </CardWrapper>
  )
}

const CardContent: React.FC<{ variants?: 'farm' | 'pm' }> = ({ variants }) => {
  const { t } = useTranslation()
  const { address: account, chainId } = useAccount()
  const { locked } = useBCakeBoostLimitAndLockInfo(ChainId.BSC)
  const { isVeCakeWillSync } = useMultichainVeCakeWellSynced(chainId ?? -1)
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const isBSC = useMemo(() => chainId === ChainId.BSC, [chainId])

  if (!account)
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold>
          {t('Connect wallet to view booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active veCAKE staking position is required for activating farm yield boosters.')}
        </Text>
        <ConnectWalletButton width="100%" style={{ backgroundColor: theme.colors.textSubtle }} />
      </Box>
    )
  if (!locked)
    return (
      <Box width="100%">
        <Text color="textSubtle" fontSize={12} bold>
          {t('No CAKE locked')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active veCAKE staking position is required for activating farm yield boosters.')}
        </Text>
        <NextLink href="/cake-staking" passHref>
          <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
            {t('Go to CAKE Staking')}
          </Button>
        </NextLink>
      </Box>
    )

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Text color="secondary" fontSize={12} bold textTransform="uppercase">
          {isVeCakeWillSync ? t('Yield booster active') : t('veCAKE Not Synced')}
        </Text>
      </Flex>
      <Text color="textSubtle" fontSize={12} mb="10px">
        {isBSC
          ? variants === 'pm'
            ? t(
                'Boost the token rewards from unlimited number of Position Managers. Boost will be applied when staking. Lock more CAKE or extend your lock to receive a higher boost.',
              )
            : t(
                'Boost your CAKE rewards from V3, V2 and StableSwap farms. Boost will be applied when staking. Lock more CAKE or extend your lock to receive a higher boost.',
              )
          : isVeCakeWillSync
          ? t('Boost unlimited number of positions on all V3 Farms. Boost will be applied when staking.')
          : t('You need to sync your veCAKE to the current network to activate farm yield boosters.')}
      </Text>
      {!isBSC && isVeCakeWillSync && (
        <Text fontSize={12} mb="10px" color="textSubtle">
          {t(
            'You will need to re-sync your veCAKE after extending or adding more CAKE to your veCAKE staking position.',
          )}
        </Text>
      )}
      <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }} onClick={() => setIsOpen(true)}>
        {t('Sync veCAKE')}
      </Button>
      {isBSC ? (
        <CrossChainVeCakeModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onDismiss={() => {
            setIsOpen(false)
          }}
        />
      ) : (
        <SwitchToBnbChainModal isOpen={isOpen} onDismiss={() => setIsOpen(false)} />
      )}
    </Box>
  )
}
