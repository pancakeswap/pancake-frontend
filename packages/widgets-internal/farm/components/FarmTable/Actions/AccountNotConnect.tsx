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
      <ActionContent
        style={
          bCakeInfoSlot
            ? {
                gap: 16,
                flexDirection: isMobile ? "column" : "row",
                minHeight: isMobile ? "auto" : undefined,
              }
            : undefined
        }
      >
        <div style={bCakeInfoSlot ? { width: isMobile ? "100%" : "50%" } : undefined}>{children}</div>
        {bCakeInfoSlot}
      </ActionContent>
    </StyledActionContainer>
  );
};

export default AccountNotConnect;
