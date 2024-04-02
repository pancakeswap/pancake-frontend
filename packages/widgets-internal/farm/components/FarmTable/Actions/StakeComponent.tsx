import { useTranslation } from "@pancakeswap/localization";
import { Button, Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

export interface StakeComponentProps {
  lpSymbol: string;
  isStakeReady: boolean;
  onPresentDeposit: () => void;
  bCakeInfoSlot?: React.ReactElement;
}

const StakeComponent: React.FunctionComponent<React.PropsWithChildren<StakeComponentProps>> = ({
  lpSymbol,
  isStakeReady,
  onPresentDeposit,
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
      {(!bCakeInfoSlot || isMobile) && (
        <ActionTitles style={bCakeInfoSlot && isMobile ? { alignItems: "flex-start", width: "100%" } : undefined}>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
            {t("Stake")}
          </Text>
          <Text bold color="secondary" fontSize="12px">
            {lpSymbol}
          </Text>
        </ActionTitles>
      )}
      <ActionContent style={bCakeInfoSlot ? { flexGrow: 1, width: isMobile ? "100%" : undefined } : undefined}>
        <Button width="100%" onClick={onPresentDeposit} variant="secondary" disabled={isStakeReady}>
          {t("Stake LP")}
        </Button>
      </ActionContent>
      {bCakeInfoSlot}
    </StyledActionContainer>
  );
};

export default StakeComponent;
