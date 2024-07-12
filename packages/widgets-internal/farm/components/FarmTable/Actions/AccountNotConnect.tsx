import { useTranslation } from "@pancakeswap/localization";
import { Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const AccountNotConnect = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <ActionContent style={{ flexDirection: isMobile ? "column" : "row", gap: 16 }}>{children}</ActionContent>
    </StyledActionContainer>
  );
};

export default AccountNotConnect;
