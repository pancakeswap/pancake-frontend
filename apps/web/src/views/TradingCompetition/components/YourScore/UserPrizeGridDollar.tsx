import { Skeleton, Text } from '@pancakeswap/uikit'

interface UserPrizeGridDollarProps {
  dollarValueOfTokensReward: number | null
}

const UserPrizeGridDollar: React.FC<React.PropsWithChildren<UserPrizeGridDollarProps>> = ({
  dollarValueOfTokensReward,
}) => {
  return dollarValueOfTokensReward !== null ? (
    <Text fontSize="12px" color="textSubtle">
      ~{dollarValueOfTokensReward.toFixed(2)} USD
    </Text>
  ) : (
    <Skeleton height={24} width={80} />
  )
}

export default UserPrizeGridDollar
