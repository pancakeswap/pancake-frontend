import { useTranslation } from "@pancakeswap/localization";
import { Spinner, Text, Box, Flex, TooltipText, AutoColumn, ColumnCenter, useTooltip } from "@pancakeswap/uikit";

interface ApproveModalContentProps {
  title: string;
  isMM?: boolean;
  isBonus: boolean;
}

export const ApproveModalContent: React.FC<ApproveModalContentProps> = ({ title, isMM, isBonus }) => {
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
      </AutoColumn>
    </Box>
  );
};
