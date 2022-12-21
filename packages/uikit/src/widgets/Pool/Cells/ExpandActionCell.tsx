import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";

import { Text, ChevronDownIcon } from "../../../components";
import { BaseCell } from "./BaseCell";

interface ExpandActionCellProps {
  expanded: boolean;
  isFullLayout: boolean;
}

const StyledCell = styled(BaseCell)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  padding-right: 12px;
  padding-left: 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
    padding-right: 32px;
    padding-left: 8px;
  }
`;

const ArrowIcon = styled((props) => <ChevronDownIcon {...props} />)`
  transform: ${({ toggled }) => (toggled ? "rotate(180deg)" : "rotate(0)")};
  height: 24px;
`;

export const ExpandActionCell: React.FC<React.PropsWithChildren<ExpandActionCellProps>> = ({
  expanded,
  isFullLayout,
}) => {
  const { t } = useTranslation();
  return (
    <StyledCell role="cell">
      {isFullLayout && (
        <Text color="primary" bold>
          {expanded ? t("Hide") : t("Details")}
        </Text>
      )}
      <ArrowIcon color="primary" toggled={expanded} />
    </StyledCell>
  );
};
