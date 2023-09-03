import { useTranslation } from "@pancakeswap/localization";
import { AutoColumn, ColumnCenter } from "../../components/Column";
import { Spinner, Text, Box, Flex, TooltipText } from "../../components";
import { useTooltip } from "../../hooks/useTooltip";

interface ApproveModalContentProps {
  isMM: boolean;
  symbol: string;
}

export const ApproveModalContent: React.FC<ApproveModalContentProps> = ({ isMM, symbol }) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>{t("Pancakeswap AMM includes V3, V2 and stable swap.")}</Text>,
    { placement: "top" }
  );

  return (
    <Box width="100%" mb="49px">
      <ColumnCenter>
        <Spinner />
      </ColumnCenter>
      <AutoColumn gap="12px" justify="center">
        <Text bold mt="16px" textAlign="center">
          {t("Enable spending %symbol%", { symbol })}
        </Text>
        <Flex>
          <Text fontSize="14px">{t("Swapping thru:")}</Text>
          {isMM ? (
            <Text ml="4px" fontSize="14px">
              {t("Pancakeswap MM")}
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
      </AutoColumn>
    </Box>
  );
};
