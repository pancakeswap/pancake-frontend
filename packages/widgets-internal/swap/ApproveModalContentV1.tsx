import { useTranslation } from "@pancakeswap/localization";
import { AutoColumn, Box, ColumnCenter, Flex, Spinner, Text, TooltipText, useTooltip } from "@pancakeswap/uikit";

interface ApproveModalContentProps {
  title: string;
  isMM?: boolean;
  isBonus: boolean;
}

export const ApproveModalContentV1: React.FC<ApproveModalContentProps> = ({ title, isMM, isBonus }) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>{t("Pancakeswap AMM includes V3, V2 and stable swap.")}</Text>,
    { placement: "top" }
  );

  return (
    <Box width="100%">
      <Box mb="16px">
        <ColumnCenter>
          <Spinner />
        </ColumnCenter>
      </Box>
      <AutoColumn gap="12px" justify="center">
        <Text bold textAlign="center">
          {title}
        </Text>
        <Flex>
          <Text fontSize="14px">{t("Swapping thru:")}</Text>
          {isMM ? (
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
      </AutoColumn>
    </Box>
  );
};
