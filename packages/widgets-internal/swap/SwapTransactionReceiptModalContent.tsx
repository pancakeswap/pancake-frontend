import { useTranslation } from "@pancakeswap/localization";
import { AutoColumn, Box, CheckmarkCircleIcon, Text } from "@pancakeswap/uikit";
import { ReactNode } from "react";
import { StepTitleAnimationContainer } from "./ApproveModalContent";
import { FadePresence } from "./Logos";

interface SwaReceiptContents {
  explorerLink: ReactNode;
  children: ReactNode;
}
export const SwapTransactionReceiptModalContent = ({ explorerLink, children }: SwaReceiptContents) => {
  const { t } = useTranslation();

  return (
    <Box width="100%">
      <FadePresence>
        <Box margin="auto auto 22px auto" width="fit-content">
          <CheckmarkCircleIcon color="success" width={80} height={80} />
        </Box>
      </FadePresence>
      <AutoColumn justify="center">
        <StepTitleAnimationContainer>
          <Text bold textAlign="center">
            {t("Transaction receipt")}
          </Text>
          {explorerLink}
        </StepTitleAnimationContainer>
        {children}
      </AutoColumn>
    </Box>
  );
};
