import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { Spinner, Text, Box, Flex, TooltipText, AutoColumn, ColumnCenter, useTooltip, Column } from '@pancakeswap/uikit'
import { ReactNode, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import TokenTransferInfo from './TokenTransferInfo'
import { useUnmountingAnimation } from './useUnmountingAnimation'

enum ConfirmModalState {
  REVIEWING,
  WRAPPING,
  RESETTING_APPROVAL,
  APPROVING_TOKEN,
  PERMITTING,
  PENDING_CONFIRMATION,
}

export type PendingConfirmModalState = Extract<
  ConfirmModalState,
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.PERMITTING
  | ConfirmModalState.PENDING_CONFIRMATION
  | ConfirmModalState.WRAPPING
  | ConfirmModalState.RESETTING_APPROVAL
>

interface ApproveModalContentProps {
  title: any
  isMM: boolean
  isBonus: boolean
  currencyA: Currency
  currencyB: Currency
  amountA: string
  amountB: string
  addToWalletButtonContent: ReactNode
  confirmModalState: ConfirmModalState
  pendingModalSteps: PendingConfirmModalState[]
  attemptingTransaction: boolean
  txHash: string
}

export enum AnimationType {
  EXITING = 'exiting',
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(40px) }
  to { opacity: 1; transform: translateX(0px) }
`
const slideInAnimation = css`
  animation: ${slideIn} 400ms ease-in-out;
`
const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0px) }
  to { opacity: 0; transform: translateX(-40px) }
`
const slideOutAnimation = css`
  animation: ${slideOut} 400ms ease-in-out;
`

export const StepTitleAnimationContainer = styled(Column)<{ disableEntranceAnimation?: boolean }>`
  align-items: center;
  transition: display 400ms ease-in-out;
  ${({ disableEntranceAnimation }) =>
    !disableEntranceAnimation &&
    css`
      ${slideInAnimation}
    `}

  &.${AnimationType.EXITING} {
    ${slideOutAnimation}
  }
`

export const ApproveModalContent: React.FC<ApproveModalContentProps> = ({
  title,
  isMM,
  isBonus,
  currencyA,
  currencyB,
  amountA,
  amountB,
  confirmModalState,
  pendingModalSteps,
  addToWalletButtonContent,
  attemptingTransaction,
  txHash,
}) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>{t('Pancakeswap AMM includes V3, V2 and stable swap.')}</Text>,
    { placement: 'top' },
  )
  const symbolA = currencyA?.symbol
  const symbolB = currencyB?.symbol

  const currentStepContainerRef = useRef<HTMLDivElement>(null)
  useUnmountingAnimation(currentStepContainerRef, () => AnimationType.EXITING)

  return (
    <Box width="100%">
      {pendingModalSteps.map((step: PendingConfirmModalState) => {
        // We only render one step at a time, but looping through the array allows us to keep
        // the exiting step in the DOM during its animation.
        return (
          Boolean(step === confirmModalState) && (
            <StepTitleAnimationContainer
              // disableEntranceAnimation={pendingModalSteps[0] === confirmModalState}
              gap="md"
              key={step}
              ref={
                step === confirmModalState
                  ? currentStepContainerRef
                  : undefined || confirmModalState === ConfirmModalState.REVIEWING
              }
            >
              <Box mb="16px">
                <ColumnCenter>
                  <Spinner />
                </ColumnCenter>
              </Box>
              <AutoColumn gap="12px" justify="center">
                <Text bold textAlign="center">
                  {title[step]}
                </Text>
                {!attemptingTransaction ? (
                  <Flex>
                    <Text fontSize="14px">{t('Swapping thru:')}</Text>
                    {isMM ? (
                      <Text ml="4px" fontSize="14px">
                        {t('Pancakeswap MM')}
                      </Text>
                    ) : isBonus ? (
                      <Text ml="4px" fontSize="14px">
                        {t('Bonus Route')}
                      </Text>
                    ) : (
                      <>
                        <TooltipText ml="4px" fontSize="14px" color="textSubtle" ref={targetRef}>
                          {t('Pancakeswap AMM')}
                        </TooltipText>
                        {tooltipVisible && tooltip}
                      </>
                    )}
                  </Flex>
                ) : (
                  <Flex>
                    <>
                      <TokenTransferInfo
                        symbolA={symbolA}
                        symbolB={symbolB}
                        amountA={amountA}
                        amountB={amountB}
                        currencyA={currencyA}
                        currencyB={currencyB}
                      />
                      {addToWalletButtonContent}
                    </>
                  </Flex>
                )}
              </AutoColumn>
            </StepTitleAnimationContainer>
          )
        )
      })}
    </Box>
  )
}
