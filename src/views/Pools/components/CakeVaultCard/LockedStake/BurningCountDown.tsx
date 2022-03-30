import { useState, useCallback, memo } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useInterval from 'hooks/useInterval'

import getTimePeriods from 'utils/getTimePeriods'
import addSeconds from 'date-fns/addSeconds'
import differenceInSeconds from 'date-fns/differenceInSeconds'

const BurningCountDown = ({ lockEndTime }) => {
  const { t } = useTranslation()
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  // 1 week after lockEndTime
  const burnDate = addSeconds(parseInt(lockEndTime) * 1000, 604800)

  const updateRemainingSeconds = useCallback(() => {
    setRemainingSeconds(differenceInSeconds(burnDate, new Date()))
  }, [burnDate])

  // Update every minute
  useInterval(updateRemainingSeconds, 1000 * 60)

  const { days, hours, minutes } = getTimePeriods(remainingSeconds)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
        {t('After Burning In')}
      </Text>
      <Text color="textSubtle" bold>
        {`${days}d: ${hours}h: ${minutes}m`}
      </Text>
    </Flex>
  )
}

export default memo(BurningCountDown)
