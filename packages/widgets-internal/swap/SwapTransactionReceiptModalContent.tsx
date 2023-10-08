import { useTranslation } from "@pancakeswap/localization";
import { PropsWithChildren } from "react";
import { Text, Box, CheckmarkCircleIcon, AutoColumn } from "@pancakeswap/uikit";

export const SwapTransactionReceiptModalContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Box width="100%">
      <Box margin="auto auto 36px auto" width="fit-content">
        <CheckmarkCircleIcon color="success" width={80} height={80} />
      </Box>
      <AutoColumn gap="12px" justify="center">
        <Text bold textAlign="center">
          {t("Transaction receipt")}
        </Text>
        {children}
      </AutoColumn>
    </Box>
  );
};
