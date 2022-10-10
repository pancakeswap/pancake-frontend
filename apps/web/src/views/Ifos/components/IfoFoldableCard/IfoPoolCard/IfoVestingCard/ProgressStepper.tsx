import { useEffect, Fragment, useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { PublicIfoData } from 'views/Ifos/types'
import Step from './Step'

const Spacer = styled.div<{ isPastSpacer?: boolean }>`
  width: 100%;
  height: 2px;
  border-radius: 4px;
  margin: 10px 4px auto 4px;
  background-color: ${({ isPastSpacer, theme }) =>
    isPastSpacer ? theme.colors.textSubtle : theme.colors.textDisabled};
`

interface ProgressStepperProps {
  poolId: PoolIds
  publicIfoData: PublicIfoData
}

const ProgressStepper: React.FC<React.PropsWithChildren<ProgressStepperProps>> = ({ poolId, publicIfoData }) => {
  const { t } = useTranslation()
  const [steps, setSteps] = useState([])
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  useEffect(() => {
    const { vestingStartTime } = publicIfoData
    const { cliff, duration } = publicIfoData[poolId]?.vestingInformation

    const currentTimeStamp = new Date().getTime()
    const timeSalesEnded = vestingStartTime * 1000
    const timeCliff = vestingStartTime === 0 ? currentTimeStamp : (vestingStartTime + cliff) * 1000
    const timeVestingEnd = vestingStartTime === 0 ? currentTimeStamp : (vestingStartTime + duration) * 1000

    let index = 0
    if (vestingStartTime > 0) {
      if (currentTimeStamp >= timeVestingEnd) {
        index = 2
      } else if (timeVestingEnd >= currentTimeStamp && timeCliff <= currentTimeStamp) {
        index = 1
      } else {
        index = 0
      }
    }

    setActiveStepIndex(index)
    setSteps([
      { text: t('Sales ended'), timeStamp: timeSalesEnded },
      { text: cliff === 0 ? t('Vesting Start') : t('Cliff'), timeStamp: timeCliff },
      { text: t('Vesting end'), timeStamp: timeVestingEnd },
    ])
  }, [t, poolId, publicIfoData])

  return (
    <Flex>
      {steps.map((step, index: number) => {
        const isPastSpacer = index < activeStepIndex

        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            <Step index={index} stepText={step.text} timeStamp={step.timeStamp} activeStepIndex={activeStepIndex} />
            {index + 1 < steps.length && <Spacer isPastSpacer={isPastSpacer} />}
          </Fragment>
        )
      })}
    </Flex>
  )
}

export default ProgressStepper
