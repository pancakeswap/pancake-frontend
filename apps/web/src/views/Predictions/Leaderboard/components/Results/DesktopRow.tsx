import { Td, Text } from '@pancakeswap/uikit'
import { PredictionUser } from 'state/types'
import ResultAvatar from './ResultAvatar'
import { NetWinnings } from './styles'

interface DesktopRowProps {
  rank?: number
  user: PredictionUser
}

const DesktopRow: React.FC<React.PropsWithChildren<DesktopRowProps>> = ({ rank, user, ...props }) => (
  <tr {...props}>
    {rank ? (
      <Td>
        <Text textAlign="center" fontWeight="bold" color="secondary">{`#${rank}`}</Text>
      </Td>
    ) : (
      <Td />
    )}
    <Td>
      <ResultAvatar user={user} />
    </Td>
    <Td>
      <NetWinnings
        amount={user.netBNB}
        textPrefix={user.netBNB > 0 ? '+' : ''}
        textColor={user.netBNB > 0 ? 'success' : 'failure'}
      />
    </Td>
    <Td textAlign="center">
      {`${user.winRate.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}%`}
    </Td>
    <Td textAlign="center">
      <strong>{user.totalBetsClaimed.toLocaleString()}</strong>
    </Td>
    <Td textAlign="center">{user.totalBets.toLocaleString()}</Td>
  </tr>
)

export default DesktopRow
