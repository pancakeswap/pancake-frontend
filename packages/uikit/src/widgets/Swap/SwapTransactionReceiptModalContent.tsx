import { useTranslation } from "@pancakeswap/localization";
import { PropsWithChildren } from "react";
import { AutoColumn } from "../../components/Column";
import { Text, Box } from "../../components";

export const SwapTransactionReceiptModalContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Box width="100%" mb="49px">
      <AutoColumn gap="12px" justify="center">
        <Text bold mt="16px" textAlign="center">
          {t("Transaction receipt")}
        </Text>
        {children}
      </AutoColumn>
    </Box>
  );
};
