import { useTranslation } from "@pancakeswap/localization";
import { Button, Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

export interface EnableStakeActionProps {
  pendingTx: boolean;
  handleApprove: () => void;
  bCakeInfoSlot?: React.ReactElement;
}

const EnableStakeAction: React.FunctionComponent<React.PropsWithChildren<EnableStakeActionProps>> = ({
  pendingTx,
  handleApprove,
  bCakeInfoSlot,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();
  return (
    <StyledActionContainer
      style={
        bCakeInfoSlot
          ? {
              display: "flex",
              gap: 16,
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              minHeight: isMobile ? "auto" : undefined,
            }
          : undefined
      }
    >
      {!bCakeInfoSlot && (
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t("Enable Farm")}
          </Text>
        </ActionTitles>
      )}
      <ActionContent style={bCakeInfoSlot ? { flexGrow: 1, width: isMobile ? "100%" : "30%" } : undefined}>
        <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
          {t("Enable")}
        </Button>
      </ActionContent>
      {bCakeInfoSlot}
    </StyledActionContainer>
  );
};

export default EnableStakeAction;
