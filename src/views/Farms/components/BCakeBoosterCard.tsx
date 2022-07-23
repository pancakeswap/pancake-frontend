import { Button, Card, CardBody, CardFooter, Text, Box, Flex } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { useBCakeFarmBoosterProxyFactoryContract } from 'hooks/useContract'
import styled from 'styled-components'
import { useBCakeProxyContractAddress } from '../hooks/useBCakeProxyContractAddress'
import { useUserBoosterStatus } from '../hooks/useUserBoosterStatus'

export const CardWrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 25px;
  width: 328px;
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
      <Card>
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
  if (account && !proxyCreated) {
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold mt="-12px">
          {t('Available Yield Booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active fixed-term CAKE staking position is required for activating farm yield boosters.')}
        </Text>
        <Button onClick={() => farmBoosterProxyFactoryContract.createFarmBoosterProxy()}>{t('Enable')}</Button>
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
