import { Box, Card, CardBody, CardHeader, ExpandableButton, Flex, Text, Message, Button } from '@pancakeswap/uikit'
import { ActionContainer } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import Balance from 'components/Balance'
import { TokenPairImage } from 'components/TokenImage'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { convertSharesToCake, getCakeVaultEarnings } from 'views/Pools/helpers'
import { useVaultPoolByKeyV1 } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'

const StyledCardMobile = styled(Card)`
  max-width: 400px;
  width: 100%;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

const StyledCardBody = styled(CardBody)`
  display: grid;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  gap: 16px;
  ${ActionContainer} {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.invertedContrast};
  }
`

const StyledEndedTag = styled.div`
  position: absolute;
  top: 15px;
  left: -20px;
  width: 100px;
  transform: rotate(318deg);
  color: white;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.failure};
  z-index: 7;
  padding: 2px 0;
`
interface IfoPoolVaultCardMobileProps {
  account: string
  pool: DeserializedPool
}

const IfoPoolVaultCardMobile: React.FC<IfoPoolVaultCardMobileProps> = ({ account, pool }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

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
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <StyledEndedTag>{t('Ended')}</StyledEndedTag>
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <TokenPairImage width={24} height={24} primaryToken={tokens.cake} secondaryToken={tokens.cake} />
            <Box ml="8px">
              <Text small bold>
                {t('IFO CAKE')}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Stake')} CAKE
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('%asset% Staked', { asset: 'CAKE' })}
            </Text>
            <Balance small bold decimals={3} value={stakedBalance} />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <>
          <StyledCardBody>
            <Message variant="warning" mb="20px">
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
            <ActionContainer>
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
            </ActionContainer>
          </StyledCardBody>
        </>
      )}
    </StyledCardMobile>
  )
}

export default IfoPoolVaultCardMobile
