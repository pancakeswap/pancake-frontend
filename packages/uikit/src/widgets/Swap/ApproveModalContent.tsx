import { useTranslation } from "@pancakeswap/localization";
import { AutoColumn, ColumnCenter } from "../../components/Column";
import { Spinner, Text, Box } from "../../components";

interface ApproveModalContentProps {
  symbol: string;
}

export const ApproveModalContent: React.FC<ApproveModalContentProps> = ({ symbol }) => {
  const { t } = useTranslation();
  return (
    <Box width="100%" mb="49px">
      <ColumnCenter>
        <Spinner />
      </ColumnCenter>
      <AutoColumn gap="12px" justify="center">
        <Text bold mt="16px" textAlign="center">
          {t("Enable spending %symbol%", { symbol })}
        </Text>
      </AutoColumn>
    </Box>
  );
};
