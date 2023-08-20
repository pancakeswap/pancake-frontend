import { Flex, Text, IconButton, AddIcon, MinusIcon, useModal, Skeleton, Box, Balance, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { VaultKey } from 'state/types'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { Token } from '@pancakeswap/sdk'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'
import ConvertToLock from '../../LockedPool/Common/ConvertToLock'

interface HasStakeActionProps {
  pool: Pool.DeserializedPool<Token>
  stakingTokenBalance: BigNumber
  performanceFee: number
}

const HasSharesActions: React.FC<React.PropsWithChildren<HasStakeActionProps>> = ({
  pool,
  stakingTokenBalance,
  performanceFee,
}) => {
  const {
    userData: {
      balance: { cakeAsBigNumber, cakeAsNumberBalance },
    },
  } = useVaultPoolByKey(pool.vaultKey)

  const { stakingToken, stakingTokenPrice } = pool

  const cakePriceBusd = usePriceCakeUSD()
  const stakedDollarValue = cakePriceBusd.gt(0)
    ? getBalanceNumber(cakeAsBigNumber.multipliedBy(cakePriceBusd), stakingToken.decimals)
    : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(
    <VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />,
    true,
    true,
    `withdraw-vault-${pool.sousId}-${pool.vaultKey}`,
  )

  return (
    <>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Balance fontSize="20px" bold value={cakeAsNumberBalance} decimals={5} />
          <Text as={Flex} fontSize="12px" color="textSubtle" flexWrap="wrap">
            {cakePriceBusd.gt(0) ? (
              <Balance
                value={stakedDollarValue}
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                unit=" USD"
              />
            ) : (
              <Skeleton mt="1px" height={16} width={64} />
            )}
          </Text>
        </Flex>
        <Flex>
          <IconButton
            variant="secondary"
            onClick={() => {
              onPresentUnstake()
            }}
            mr="6px"
          >
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          <IconButton variant="secondary" onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </Flex>
      </Flex>
      {pool.vaultKey === VaultKey.CakeVault && (
        <Box mb="16px">
          <ConvertToLock
            stakingToken={stakingToken}
            stakingTokenPrice={stakingTokenPrice}
            currentStakedAmount={cakeAsNumberBalance}
          />
        </Box>
      )}
    </>
  )
}

export default HasSharesActions
