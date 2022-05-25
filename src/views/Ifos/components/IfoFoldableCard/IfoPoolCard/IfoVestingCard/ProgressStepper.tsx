import { useEffect, Fragment, useState } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
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
  publicIfoData: PublicIfoData
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ publicIfoData }) => {
  const { t } = useTranslation()
  const [steps, setSteps] = useState([])
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  useEffect(() => {
    const { vestingStartTime, poolUnlimited } = publicIfoData
    const { cliff, duration } = poolUnlimited.vestingInfomation

    const currentTimeStamp = new Date().getTime()
    const timeSalesEnded = vestingStartTime * 1000
    const timeCliff = vestingStartTime === 0 ? currentTimeStamp : (vestingStartTime + cliff) * 1000
    const timeVestingEnd = vestingStartTime === 0 ? currentTimeStamp : (vestingStartTime + duration) * 1000

    let index = 0
    if (vestingStartTime) {
      if (currentTimeStamp <= timeSalesEnded) {
        index = 0
      } else if (currentTimeStamp >= timeCliff && timeVestingEnd <= currentTimeStamp) {
        index = 1
      } else {
        index = 2
      }
    }

    setActiveStepIndex(index)
    setSteps([
      { text: t('Sales ended'), timeStamp: timeSalesEnded },
      { text: t('Cliff'), timeStamp: timeCliff },
      { text: t('Vesting end'), timeStamp: timeVestingEnd },
    ])
  }, [t, publicIfoData])

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
