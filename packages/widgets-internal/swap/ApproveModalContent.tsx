import { useTranslation } from "@pancakeswap/localization";
import { Currency } from "@pancakeswap/swap-sdk-core";
import { AutoColumn, Box, Column, ColumnCenter, Flex, Text, TooltipText, useTooltip } from "@pancakeswap/uikit";
import { FC, ReactNode, Ref, useMemo, useRef } from "react";
import styled, { css } from "styled-components";
import { ApprovalPhaseIcon } from "./Logos";
import { AnimationType, slideInAnimation, slideOutAnimation } from "./styles";
import { useUnmountingAnimation } from "./useUnmountingAnimation";

export enum ConfirmModalState {
  REVIEWING,
  WRAPPING,
  RESETTING_APPROVAL,
  APPROVING_TOKEN,
  PERMITTING,
  PENDING_CONFIRMATION,
  COMPLETED,
}

export type PendingApproveModalState = Extract<
  ConfirmModalState,
  ConfirmModalState.APPROVING_TOKEN | ConfirmModalState.PERMITTING | ConfirmModalState.RESETTING_APPROVAL
>;

type AllowedAllowanceState =
  | ConfirmModalState.RESETTING_APPROVAL
  | ConfirmModalState.APPROVING_TOKEN
  | ConfirmModalState.PERMITTING;

interface ApproveModalContentProps {
  title: {
    [step in AllowedAllowanceState]: string;
  };
  isMM: boolean | undefined;
  isX: boolean;
  isBonus: boolean;
  currencyA: Currency;
  asBadge: boolean;
  currentStep: ConfirmModalState;
  approvalModalSteps: PendingApproveModalState[];
}

interface StepTitleAnimationContainerProps {
  disableEntranceAnimation?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export const StepTitleAnimationContainer: FC<StepTitleAnimationContainerProps> = styled(
  Column
)<StepTitleAnimationContainerProps>`
  align-items: center;
  transition: display 300ms ease-in-out;
  ${({ disableEntranceAnimation }) =>
    !disableEntranceAnimation &&
    css`
      ${slideInAnimation}
    `}

  &.${AnimationType.EXITING} {
    ${slideOutAnimation}
  }
`;

export const ApproveModalContent: React.FC<ApproveModalContentProps> = ({
  title,
  isX,
  isMM,
  isBonus,
  currencyA,
  asBadge,
  currentStep,
  approvalModalSteps,
}) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>{t("Pancakeswap AMM includes V3, V2 and stable swap.")}</Text>,
    { placement: "top" }
  );

  const currentStepContainerRef = useRef<HTMLDivElement>(null);
  useUnmountingAnimation(currentStepContainerRef, () => AnimationType.EXITING);
  const disableEntranceAnimation = approvalModalSteps[0] === currentStep;

  return useMemo(
    () => (
      <Box width="100%">
        <Flex height="160px" alignItems="center">
          <ColumnCenter>
            <ApprovalPhaseIcon currency={currencyA} asBadge={asBadge} />
          </ColumnCenter>
        </Flex>
        <AutoColumn gap="12px" justify="center">
          {approvalModalSteps.map((step: PendingApproveModalState) => {
            return (
              Boolean(step === currentStep) && (
                <StepTitleAnimationContainer
                  disableEntranceAnimation={disableEntranceAnimation}
                  key={step}
                  ref={step === currentStep ? currentStepContainerRef : undefined}
                >
                  <Text bold textAlign="center">
                    {title[step]}
                  </Text>
                  <Flex>
                    <Text fontSize="14px">{t("Swapping thru:")}</Text>
                    {isX ? (
                      <Text ml="4px" fontSize="14px">
                        PancakeSwap X
                      </Text>
                    ) : isMM ? (
                      <Text ml="4px" fontSize="14px">
                        {t("Pancakeswap MM")}
                      </Text>
                    ) : isBonus ? (
                      <Text ml="4px" fontSize="14px">
                        {t("Bonus Route")}
                      </Text>
                    ) : (
                      <>
                        <TooltipText ml="4px" fontSize="14px" color="textSubtle" ref={targetRef}>
                          {t("Pancakeswap AMM")}
                        </TooltipText>
                        {tooltipVisible && tooltip}
                      </>
                    )}
                  </Flex>
                </StepTitleAnimationContainer>
              )
            );
          })}
        </AutoColumn>
      </Box>
    ),
    [
      currencyA,
      isBonus,
      isX,
      isMM,
      t,
      targetRef,
      title,
      tooltip,
      tooltipVisible,
      asBadge,
      approvalModalSteps,
      currentStep,
      disableEntranceAnimation,
    ]
  );
};
