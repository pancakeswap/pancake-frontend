import { Text, Flex, Image, Box } from '@pancakeswap/uikit'
import { BalanceWithLoading } from 'components/Balance'
import Divider from 'components/Divider'

const StaticAmount = ({ stakingSymbol, stakingAddress, lockedAmount, usdValueStaked }) => (
  <>
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      ADD CAKE TO LOCK
    </Text>
    <Flex alignItems="center" justifyContent="space-between" mb="16px">
      <Box>
        <BalanceWithLoading color="text" bold fontSize="16px" value={lockedAmount} decimals={2} />
        <BalanceWithLoading
          value={usdValueStaked}
          fontSize="12px"
          color="textSubtle"
          decimals={2}
          prefix="~"
          unit=" USD"
        />
      </Box>
      <Flex alignItems="center" minWidth="70px">
        <Image src={`/images/tokens/${stakingAddress}.png`} width={24} height={24} alt={stakingSymbol} />
        <Text ml="4px" bold>
          {stakingSymbol}
        </Text>
      </Flex>
    </Flex>
    <Divider />
  </>
)
export default StaticAmount
