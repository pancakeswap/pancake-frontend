import { Currency } from "@pancakeswap/sdk";
import { ArrowUpIcon, AutoColumn, Box, ColumnCenter, Text } from "@pancakeswap/uikit";
import { ReactNode, useRef } from "react";
import { ConfirmModalState, StepTitleAnimationContainer } from "./ApproveModalContent";
import { FadePresence, PendingSwapConfirmationIcon } from "./Logos";
import TokenTransferInfo from "./TokenTransferInfo";
import { AnimationType } from "./styles";
import { useUnmountingAnimation } from "./useUnmountingAnimation";

interface SwapPendingModalContentProps {
  title: string;
  showIcon?: boolean;
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  amountA: string;
  amountB: string;
  currentStep: ConfirmModalState;
  children?: ReactNode;
}

export const SwapPendingModalContent: React.FC<SwapPendingModalContentProps> = ({
  title,
  showIcon,
  currencyA,
  currencyB,
  amountA,
  amountB,
  currentStep,
  children,
}) => {
  const symbolA = currencyA?.symbol;
  const symbolB = currencyB?.symbol;

  const currentStepContainerRef = useRef<HTMLDivElement>(null);
  useUnmountingAnimation(currentStepContainerRef, () => AnimationType.EXITING);

  return (
    <Box width="100%">
      {showIcon ? (
        <FadePresence $scale>
          <Box margin="auto auto 22px auto" width="fit-content">
            <ArrowUpIcon color="success" width={80} height={80} />
          </Box>
        </FadePresence>
      ) : (
        <Box mb="16px">
          <ColumnCenter>
            <PendingSwapConfirmationIcon />
          </ColumnCenter>
        </Box>
      )}
      <AutoColumn gap="12px" justify="center">
        <StepTitleAnimationContainer
          ref={currentStep === ConfirmModalState.PENDING_CONFIRMATION ? currentStepContainerRef : undefined}
        >
          <Text bold textAlign="center">
            {title}
          </Text>
          <TokenTransferInfo
            symbolA={symbolA}
            symbolB={symbolB}
            amountA={amountA}
            amountB={amountB}
            currencyA={currencyA}
            currencyB={currencyB}
          />
          {children}
        </StepTitleAnimationContainer>
      </AutoColumn>
    </Box>
  );
};
