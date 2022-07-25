import { AutoRenewIcon, Box, Button, Card, CardBody, CardFooter, Flex, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useTranslation } from 'contexts/Localization'
import { useBCakeFarmBoosterProxyFactoryContract } from 'hooks/useContract'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import { useBCakeProxyContractAddress } from '../hooks/useBCakeProxyContractAddress'
import { useUserBoosterStatus } from '../hooks/useUserBoosterStatus'
import { useUserLockedCakeStatus } from '../hooks/useUserLockedCakeStatus'
import boosterCardImage from '../images/boosterCardImage.png'

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
  return (
    <CardWrapper>
      <ImageWrapper>
        <Image src={boosterCardImage} alt="boosterCardImage" width={99} height={233} placeholder="blur" />
      </ImageWrapper>
      <Card style={{ zIndex: 1 }}>
        <StyledCardBody>
          <Text fontSize={22} bold color="text" marginBottom="-12px">
            {t('Yield Booster')}
          </Text>
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
  const farmBoosterProxyFactoryContract = useBCakeFarmBoosterProxyFactoryContract()
  const { proxyCreated } = useBCakeProxyContractAddress(account)
  const { maxBoostCounts, remainingCounts } = useUserBoosterStatus(account)
  const { locked, lockedEnd } = useUserLockedCakeStatus()
  const [isCreateProxyLoading, setIsCreateProxyLoading] = useState(false)
  const { push } = useRouter()
  if (!account)
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold mt="-12px">
          {t('Connect wallet to view booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term CAKE staking position is required for activating farm yield boosters.')}
        </Text>
        <ConnectWalletButton />
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
        <Button onClick={() => push('/pools')} width="100%">
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
        <Button onClick={() => push('/pools')} width="100%">
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
        <Button
          onClick={async () => {
            try {
              setIsCreateProxyLoading(true)
              await farmBoosterProxyFactoryContract.createFarmBoosterProxy({ gasLimit: DEFAULT_GAS_LIMIT })
            } catch (error) {
              console.error(error)
            } finally {
              setIsCreateProxyLoading(false)
            }
          }}
          isLoading={isCreateProxyLoading}
          width="100%"
          endIcon={isCreateProxyLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {isCreateProxyLoading ? t('Confirming...') : t('Enable')}
        </Button>
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
