import { useTranslation } from "@pancakeswap/localization";
import { Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const AccountNotConnect = ({
  children,
  bCakeInfoSlot,
}: {
  children: React.ReactNode;
  bCakeInfoSlot?: React.ReactElement;
}) => {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <div
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
        <ActionContent style={bCakeInfoSlot ? { flexGrow: 1, width: isMobile ? "100%" : "50%" } : undefined}>
          {children}
        </ActionContent>
        {bCakeInfoSlot}
      </div>
    </StyledActionContainer>
  );
};

export default AccountNotConnect;
