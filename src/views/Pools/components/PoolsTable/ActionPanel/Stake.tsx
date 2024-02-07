import { Button, Flex, IconButton, MinusIcon, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'

import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { convertSharesToCake } from 'views/Pools/helpers'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import { useApprovePool, useCheckVaultApprovalStatus, useVaultApprove } from '../../../hooks/useApprove'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'
import StakeModal from '../../PoolCard/Modals/StakeModal'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps {
  pool: DeserializedPool
  userDataLoaded: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pool, userDataLoaded }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    poolCategory,
    userData,
    stakingTokenPrice,
    vaultKey,
    profileRequirement,
  } = pool
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const stakingTokenContract = useERC20(stakingToken.address || '')
  const { handleApprove: handlePoolApprove } = useApprovePool(stakingTokenContract, sousId, earningToken.symbol)

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(pool.vaultKey)
  const { handleApprove: handleVaultApprove } = useVaultApprove(pool.vaultKey, setLastUpdated)

  const handleApprove = vaultKey ? handleVaultApprove : handlePoolApprove

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !vaultKey && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const {
    userData: { userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)

  const { cakeAsBigNumber, cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare)
  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = vaultKey && hasSharesStaked
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const needsApproval = vaultKey ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  const onUnstake = () => {
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (notMeetRequired || notMeetThreshold) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" disabled onClick={handleApprove} variant="secondary">
            {t('Enable')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    return (
      <ActionContainer isAutoVault={!!vaultKey}>
        <ActionTitles>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {stakingToken.symbol}{' '}
          </Text>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {vaultKey ? t('Staked (compounding)') : t('Staked')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
            <Balance
              lineHeight="1"
              bold
              fontSize="20px"
              decimals={5}
              value={vaultKey ? cakeAsNumberBalance : stakedTokenBalance}
            />
            <Balance
              fontSize="12px"
              display="inline"
              color="textSubtle"
              decimals={2}
              value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
              unit=" USD"
              prefix="~"
            />
          </Flex>
          <IconButtonWrapper>
            <IconButton variant="secondary" onClick={onUnstake} mr="6px">
              <MinusIcon color="primary" width="14px" />
            </IconButton>
          </IconButtonWrapper>
        </ActionContent>
      </ActionContainer>
    )
  }

  return null
}

export default Staked
