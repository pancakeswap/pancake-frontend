import { Box, Text, Skeleton, BoxProps } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { StyledVolumeText } from 'views/TradingCompetition/components/TeamRanks/Podium/styles'

interface PodiumTextProps extends BoxProps {
  title: string
  amount: string
}

const PodiumText: React.FC<React.PropsWithChildren<PodiumTextProps>> = ({ title, amount, ...props }) => {
  return (
    <Box {...props}>
      {amount ? (
        <StyledVolumeText textAlign="center" bold>{`$${formatNumber(Number(amount), 0)}`}</StyledVolumeText>
      ) : (
        <Skeleton width="77px" height="24px" />
      )}
      <Text fontSize="12px" color="textSubtle">
        {title}
      </Text>
    </Box>
  )
}

export default PodiumText
