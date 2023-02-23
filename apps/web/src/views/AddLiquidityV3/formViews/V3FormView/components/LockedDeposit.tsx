import { AutoColumn, Text } from '@pancakeswap/uikit'
import { Lock } from 'react-feather'
import { LightGreyCard } from 'components/Card'

export default function LockedDeposit({ children, locked, ...rest }) {
  return locked ? (
    <LightGreyCard {...rest}>
      <AutoColumn justify="center">
        <Lock />
        <Text fontSize="12px" textAlign="center">
          The market price is outside your specified price range. Single-asset deposit only.
        </Text>
      </AutoColumn>
    </LightGreyCard>
  ) : (
    children
  )
}
