import { Token } from '@pancakeswap/sdk'
import { Td, Text } from '@pancakeswap/uikit'
import { PredictionUser } from 'state/types'
import ResultAvatar from './ResultAvatar'
import { NetWinnings } from './styles'

interface DesktopRowProps {
  rank?: number
  user: PredictionUser
  api: string
  token: Token | undefined
}

const DesktopRow: React.FC<React.PropsWithChildren<DesktopRowProps>> = ({ rank, user, api, token, ...props }) => (
  <tr {...props}>
    {rank ? (
      <Td>
        <Text textAlign="center" fontWeight="bold" color="secondary">{`#${rank}`}</Text>
      </Td>
    ) : (
      <Td />
    )}
    <Td>
      <ResultAvatar user={user} api={api} token={token} />
    </Td>
    <Td>
      <NetWinnings
        token={token}
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
      <strong>{user.totalBetsClaimed}</strong>
    </Td>
    <Td textAlign="center">{user.totalBets}</Td>
  </tr>
)

export default DesktopRow
