import { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  ExpandableButton,
  Flex,
  Text,
  TokenPairImage as UITokenPairImage,
} from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import { vaultPoolConfig } from 'config/constants/pools'
import { DeserializedPool, VaultKey } from 'state/types'
import { StakingApy } from 'views/Pools/components/CakeVaultCard/StakingApy'
import { VaultPositionTagWithLabel } from 'views/Pools/components/Vault/VaultPositionTag'
import LockedStakingApy from 'views/Pools/components/LockedPool/LockedStakingApy'
import UnstakingFeeCountdownRow from 'views/Pools/components/CakeVaultCard/UnstakingFeeCountdownRow'
import RecentCakeProfitRow from 'views/Pools/components/CakeVaultCard/RecentCakeProfitRow'
import VaultCardActions from 'views/Pools/components/CakeVaultCard/VaultCardActions'
import CardFooter from 'views/Pools/components/PoolCard/CardFooter'

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
`

interface IfoPoolVaultCardMobileProps {
  pool: DeserializedPool
}

const IfoPoolVaultCardMobile: React.FC<IfoPoolVaultCardMobileProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [isExpanded, setIsExpanded] = useState(false)

  const vaultPool = useVaultPoolByKey(pool.vaultKey)

  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
  } = vaultPool

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading

  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <UITokenPairImage width={24} height={24} {...vaultPoolConfig[VaultKey.CakeVault].tokenImage} />
            <Box ml="8px" width="50px">
              <Text small bold>
                {vaultPoolConfig[VaultKey.CakeVault].name}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Stake')} CAKE
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('IFO Credit')}
            </Text>
            <Balance small bold decimals={3} value={1} />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <>
          <StyledCardBody>
            {account && <VaultPositionTagWithLabel userData={vaultPool.userData} />}
            {account && vaultPool?.userData?.locked ? (
              <LockedStakingApy
                userData={vaultPool?.userData}
                stakingToken={pool?.stakingToken}
                stakingTokenBalance={pool?.userData?.stakingTokenBalance}
              />
            ) : (
              <>
                <StakingApy pool={pool} />
                <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
                  <Box>
                    {account && (
                      <Box mb="8px">
                        <UnstakingFeeCountdownRow vaultKey={pool.vaultKey} />
                      </Box>
                    )}
                    <RecentCakeProfitRow pool={pool} />
                  </Box>
                  <Flex flexDirection="column">
                    {account ? (
                      <VaultCardActions
                        pool={pool}
                        accountHasSharesStaked={accountHasSharesStaked}
                        isLoading={isLoading}
                        performanceFee={performanceFeeAsDecimal}
                      />
                    ) : (
                      <>
                        <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                          {t('Start earning')}
                        </Text>
                        <ConnectWalletButton />
                      </>
                    )}
                  </Flex>
                </FlexGap>
              </>
            )}
          </StyledCardBody>
          <CardFooter defaultExpanded={false} pool={pool} account={account} />
        </>
      )}
    </StyledCardMobile>
  )
}

export default IfoPoolVaultCardMobile
