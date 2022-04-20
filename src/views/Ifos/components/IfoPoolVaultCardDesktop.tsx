import { Box, Card, CardBody, CardHeader, Flex, Text, Message, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { TokenPairImage } from 'components/TokenImage'
import { useRouter } from 'next/router'
import { DeserializedPool } from 'state/types'
import { convertSharesToCake, getCakeVaultEarnings } from 'views/Pools/helpers'
import { useVaultPoolByKeyV1 } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'

const StyledCardDesktop = styled(Card)`
  width: 100%;
  align-self: flex-start;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 24px;
`

const StyledEndedTag = styled.div`
  position: absolute;
  top: 20px;
  right: -30px;
  width: 120px;
  transform: rotate(-318deg);
  color: white;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.failure};
  z-index: 7;
  padding: 4px 0;
`

interface IfoPoolVaultCardDesktopProps {
  account: string
  pool: DeserializedPool
}

const IfoPoolVaultCardDesktop: React.FC<IfoPoolVaultCardDesktopProps> = ({ account, pool }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const { vaultPoolData } = useVaultPoolByKeyV1(pool.vaultKey)
  const { pricePerFullShare } = vaultPoolData
  const { userShares, cakeAtLastUserAction } = vaultPoolData.userData

  let cakeAsNumberBalance = 0
  let earningTokenBalance = 0
  if (pricePerFullShare) {
    const { cakeAsNumberBalance: cakeBalance } = convertSharesToCake(userShares, pricePerFullShare)
    const { autoCakeToDisplay } = getCakeVaultEarnings(
      account,
      cakeAtLastUserAction,
      userShares,
      pricePerFullShare,
      pool.earningTokenPrice,
    )

    cakeAsNumberBalance = cakeBalance
    earningTokenBalance = autoCakeToDisplay
  }

  const stakedBalance = Number.isNaN(cakeAsNumberBalance) ? 0 : cakeAsNumberBalance

  const isShowMigrationButton = account && new BigNumber(stakedBalance).gt(0)

  const handleOnClick = () => {
    if (isShowMigrationButton) {
      router.push('/migration')
    } else {
      router.push('/pools')
    }
  }

  return (
    <StyledCardDesktop>
      <CardHeader p="16px">
        <StyledEndedTag>{t('Ended')}</StyledEndedTag>
        <StyledTokenContent justifyContent="space-between" alignItems="center">
          <Box ml="8px">
            <Text fontSize="24px" color="secondary" bold>
              {t('IFO CAKE')}
            </Text>
            <Text color="textSubtle" fontSize="14px">
              {t('Stake CAKE to participate in IFO')}
            </Text>
          </Box>
          <TokenPairImage width={64} height={64} primaryToken={tokens.cake} secondaryToken={tokens.cake} />
        </StyledTokenContent>
      </CardHeader>
      <StyledCardBody>
        <Message variant="warning" mb="37px">
          <Flex flexDirection="column">
            <Text mb="16px">
              {t(
                'This is the old IFO CAKE pool. Check out the brand new CAKE pool to learn how to earn CAKE rewards with higher APY while enjoying other benefits.',
              )}
            </Text>
            <Flex ml="-34px">
              <Button onClick={handleOnClick} width="100%">
                {isShowMigrationButton ? t('Migrate') : t('Go to new CAKE pool')}
              </Button>
            </Flex>
          </Flex>
        </Message>
        <Box>
          <Flex mb="4px">
            <Text fontSize="12px" color="secondary" bold mr="2px">
              CAKE
            </Text>
            <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
              {t('Staked')}
            </Text>
          </Flex>
          <Balance
            mt="4px"
            bold
            fontSize="20px"
            color={stakedBalance ? 'text' : 'textDisabled'}
            decimals={stakedBalance ? 5 : 1}
            value={stakedBalance}
          />
        </Box>
        <Box mt="24px">
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="14px">{`${t('Recent CAKE profit')}:`}</Text>
            <Balance
              bold
              fontSize="14px"
              color={earningTokenBalance > 0 ? 'text' : 'textDisabled'}
              decimals={earningTokenBalance > 0 ? 5 : 1}
              value={earningTokenBalance > 0 ? earningTokenBalance : 0}
            />
          </Flex>
        </Box>
      </StyledCardBody>
    </StyledCardDesktop>
  )
}

export default IfoPoolVaultCardDesktop
