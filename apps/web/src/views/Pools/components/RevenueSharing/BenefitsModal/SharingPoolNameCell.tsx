import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, LogoRoundIcon, Box, Balance, Pool } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useVaultPoolByKey, usePoolsWithVault } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedCakeVault } from 'state/types'
import { Token } from '@pancakeswap/sdk'

const SharingPoolNameCell = () => {
  const { t } = useTranslation()
  const { userData } = useVaultPoolByKey(VaultKey.CakeVault) as DeserializedLockedCakeVault
  const { pools } = usePoolsWithVault()

  const cakePool = useMemo(
    () => pools.find((pool) => pool.userData && pool.sousId === 0),
    [pools],
  ) as Pool.DeserializedPool<Token>
  const stakingToken = cakePool?.stakingToken
  const stakingTokenPrice = cakePool?.stakingTokenPrice

  const currentLockedAmountNumber = useMemo(
    () => userData?.balance?.cakeAsNumberBalance,
    [userData?.balance?.cakeAsNumberBalance],
  )

  const usdValueStaked = useMemo(
    () =>
      stakingToken && stakingTokenPrice
        ? getBalanceNumber(userData?.balance?.cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken?.decimals)
        : null,
    [userData?.balance?.cakeAsBigNumber, stakingTokenPrice, stakingToken],
  )

  return (
    <Flex mb="16px">
      <LogoRoundIcon mr="8px" width={43} height={43} style={{ minWidth: 43 }} />
      <Box>
        <Text fontSize={12} color="secondary" bold lineHeight="110%" textTransform="uppercase">
          {t('CAKE locked')}
        </Text>
        <Balance bold decimals={2} fontSize={20} lineHeight="110%" value={currentLockedAmountNumber} />
        <Balance
          bold
          prefix="~ "
          decimals={2}
          fontSize={12}
          fontWeight={400}
          lineHeight="110%"
          color="textSubtle"
          value={usdValueStaked}
        />
      </Box>
    </Flex>
  )
}

export default SharingPoolNameCell
