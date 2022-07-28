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
  useTooltip,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import { useRouter } from 'next/router'
import styled, { useTheme } from 'styled-components'
import { useBCakeProxyContractAddress } from '../hooks/useBCakeProxyContractAddress'
import { useUserBoosterStatus } from '../hooks/useUserBoosterStatus'
import { useUserLockedCakeStatus } from '../hooks/useUserLockedCakeStatus'
import boosterCardImage from '../images/boosterCardImage.png'
import CreateProxyButton from './YieldBooster/components/CreateProxyButton'

export const CardWrapper = styled.div`
  position: relative;
  padding-top: 42px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 296px;
    margin-left: 50px;
  }
`
export const ImageWrapper = styled.div`
  position: absolute;
  top: -20px;
  transform: translateY(-50%);
  right: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: auto;
    top: 60%;
    left: -70px;
  }
  z-index: 2;
`
const StyledCardBody = styled(CardBody)`
  border-bottom: none;
`
const StyledCardFooter = styled(CardFooter)`
  border-top: none;
  position: relative;
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

export const BCakeBoosterCard = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  const tooltipContent = (
    <>
      <Box mb="20px">
        {t(
          'Yield Boosters allow you to boost your farming yields by locking CAKE in the fixed-term staking CAKE pool. The more CAKE you lock, and the longer you lock them, the higher the boost you will receive.',
        )}
      </Box>
      <Box>
        {t('To learn more, check out the')}
        <Link href="https://pancakeswap.finance">{t('Medium Article')}</Link>
      </Box>
    </>
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })
  return (
    <CardWrapper>
      <ImageWrapper>
        <Image src={boosterCardImage} alt="boosterCardImage" width={99} height={191} placeholder="blur" />
      </ImageWrapper>
      <Card style={{ zIndex: 1 }}>
        <StyledCardBody>
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
          <CardContent />
        </StyledCardFooter>
      </Card>
    </CardWrapper>
  )
}

const CardContent: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { proxyCreated, refreshProxyAddress } = useBCakeProxyContractAddress(account)
  const { maxBoostCounts, remainingCounts } = useUserBoosterStatus(account)
  const { locked, lockedEnd } = useUserLockedCakeStatus()
  const { push } = useRouter()
  const theme = useTheme()

  if (!account)
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold mt="-12px">
          {t('Connect wallet to view booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term CAKE staking position is required for activating farm yield boosters.')}
        </Text>
        <ConnectWalletButton width="100%" style={{ backgroundColor: theme.colors.textSubtle }} />
      </Box>
    )
  if (!locked)
    return (
      <Box width="100%">
        <Text color="textSubtle" fontSize={12} bold mt="-12px">
          {t('No CAKE locked')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term CAKE staking position is required for activating farm yield boosters.')}
        </Text>
        <Button onClick={() => push('/pools')} width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
          {t('Go to Pool')}
        </Button>
      </Box>
    )
  if (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000))
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold mt="-12px">
          {t('Locked staking is ended')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term CAKE staking position is required for activating farm yield boosters.')}
        </Text>
        <Button onClick={() => push('/pools')} width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
          {t('Go to Pool')}
        </Button>
      </Box>
    )
  if (!proxyCreated) {
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold mt="-12px">
          {t('Available Yield Booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('A one-time setup is required for enabling farm yield boosters.')}
        </Text>
        <CreateProxyButton onDone={refreshProxyAddress} style={{ backgroundColor: theme.colors.textSubtle }} />
      </Box>
    )
  }
  if (remainingCounts > 0)
    return (
      <Box>
        <Flex justifyContent="space-between">
          <Text color="secondary" fontSize={12} bold mt="-12px" textTransform="uppercase">
            {t('Available Yield Booster')}
          </Text>
          <Text color="secondary" fontSize={12} bold mt="-12px" textTransform="uppercase">
            {remainingCounts}/{maxBoostCounts}
          </Text>
        </Flex>

        <Text color="textSubtle" fontSize={12} mb="-8px">
          {t('You will be able to activate the yield booster on an additional %num% farm(s).', {
            num: remainingCounts,
          })}
        </Text>
      </Box>
    )
  return (
    <Box>
      <Flex justifyContent="space-between">
        <Text color="secondary" fontSize={12} bold mt="-12px" textTransform="uppercase">
          {t('Available Yield Booster')}
        </Text>
        <Text color="secondary" fontSize={12} bold mt="-12px" textTransform="uppercase">
          0
        </Text>
      </Flex>

      <Text color="textSubtle" fontSize={12} mb="-8px">
        {t('To activate yield boosters on additional farms, unset yield boosters on some currently boosted farms.')}
      </Text>
    </Box>
  )
}
