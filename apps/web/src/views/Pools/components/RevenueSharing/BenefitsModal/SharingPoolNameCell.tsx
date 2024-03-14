import { useTranslation } from '@pancakeswap/localization'
import { Balance, Box, Flex, LogoRoundIcon, Text } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'

import { Token } from '@pancakeswap/sdk'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { usePoolsWithVault, useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCakeVault, VaultKey } from 'state/types'

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
        <Balance bold decimals={2} fontSize={20} lineHeight="110%" value={currentLockedAmountNumber ?? 0} />
        <Balance
          bold
          prefix="~ "
          unit=" USD"
          decimals={2}
          fontSize={12}
          fontWeight={400}
          lineHeight="110%"
          color="textSubtle"
          value={usdValueStaked ?? 0}
        />
      </Box>
    </Flex>
  )
}

export default SharingPoolNameCell
