import { UilLink, UilSync, UilUser } from '@iconscout/react-unicons'
import { usePushClient } from 'contexts/PushClientContext'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Container, Divider, StepContainer, StepIcon, StepWrapper, StyledCheckIcon } from 'views/Notifications/styles'

export interface ProgressStepperProps {
  latestStep: number
}
export type StepTypes = {
  description: string
  currentStep: boolean
  pendingStep: boolean
  completedStep: boolean
}

export const StepDescriptions: string[][] = [
  ['authorizing', 'syncing', 'subscribing'],
  ['authorized', 'synced', 'subscribing'],
  ['authorized', 'synced', 'subscribing'],
  ['authorized', 'synced', 'subscribing'],
]

const PancakeCheckMarkIcon = ({ index, stepLength }: { index: number; stepLength: number }) => (
  <>
    <Image src="/logo.png" width={35} height={35} alt="" />
    <StyledCheckIcon index={index} stepLength={stepLength} />
  </>
)

const ProgressStepBar = () => {
  const [newStep, setNewStep] = useState<StepTypes[]>([])
  const [text, setText] = useState<Array<string>>(StepDescriptions[0])
  const { pushRegisterMessage, isOnBoarded, isSubscribed } = usePushClient()

  let latestStep = 3
  if (isOnBoarded && !isSubscribed) latestStep = 2
  if (!isOnBoarded) latestStep = pushRegisterMessage?.includes('did:key') ? 0 : 1

  const updateStep = useCallback(
    (stepNumber: number, steps: StepTypes[], stepsText: Array<string>) => {
      const newSteps = steps.map((step, count) => {
        return {
          ...step,
          description: stepsText[count],
          currentStep: count === stepNumber,
          pendingStep: count <= stepNumber,
          completedStep: count <= stepNumber,
        }
      })
      setText(StepDescriptions[latestStep])
      return newSteps
    },
    [latestStep],
  )

  useEffect(() => {
    const stepsState = StepDescriptions[0].map((step) => ({
      description: step,
      completedStep: false,
      currentStep: false,
      pendingStep: false,
    }))
    const current = updateStep(latestStep - 1, stepsState, text)
    setNewStep(current)
  }, [latestStep, text, updateStep])

  const stepsDisplay = newStep.map((step, index) => {
    return (
      <StepContainer key={step.description} index={index} stepLength={newStep.length}>
        <StepWrapper>
          <StepIcon pendingStep={step.pendingStep} nextStep={!step.pendingStep && !step.completedStep} index={index}>
            {step.completedStep ? <PancakeCheckMarkIcon index={index} stepLength={newStep.length} /> : null}
            {!step.completedStep && index === 0 ? <UilSync size="20px" color="#7A6DAA" stroke={5} /> : null}
            {!step.completedStep && index === 1 ? <UilLink size="20px" color="#7A6DAA" strokeWidth={5} /> : null}
            {!step.completedStep && index === 2 ? <UilUser size="20px" color="#7A6DAA" strokeWidth={5} /> : null}
          </StepIcon>
        </StepWrapper>
        <Divider completedStep={step.completedStep} />
      </StepContainer>
    )
  })

  return <Container>{stepsDisplay}</Container>
}
export default ProgressStepBar
