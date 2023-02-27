import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { format } from 'date-fns'

interface PropsType {
  title: React.ReactNode
  value: Date
  color: string
}

const DateRow: React.FC<React.PropsWithChildren<PropsType>> = ({ title, value, color }) => {
  const { t } = useTranslation()
  const tooltipContent = t(
    'You will be able to withdraw the staked CAKE and profit only when the staking position is unlocked, i.e. when the staking period ends.',
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText>
        <Text ref={targetRef} color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {title}
        </Text>
      </TooltipText>
      <Text bold color={color}>
        {value ? format(value, 'MMM do, yyyy HH:mm') : '-'}
      </Text>
    </Flex>
  )
}

export default DateRow
