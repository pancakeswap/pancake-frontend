import { useEffect, useState } from 'react'
import { Flex, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import CountdownCircle from './CountdownCircle'

const UpdateIndicator: React.FC<{ isFetchingPancakeBunnies: boolean }> = ({ isFetchingPancakeBunnies }) => {
  const { t } = useTranslation()
  const [secondsRemaining, setSecondsRemaining] = useState(10)
  const { tooltip, tooltipVisible, targetRef } = useTooltip(t('Items in the table update every 10 seconds'), {
    placement: 'auto',
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!isFetchingPancakeBunnies) {
      setSecondsRemaining(10)
    }
  }, [isFetchingPancakeBunnies])

  return (
    <Flex justifyContent="center" ref={targetRef}>
      <CountdownCircle secondsRemaining={secondsRemaining} isUpdating={isFetchingPancakeBunnies} />
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default UpdateIndicator
