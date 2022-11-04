import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../../../../../components/Text";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const AccountNotConnect = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <ActionContent>{children}</ActionContent>
    </StyledActionContainer>
  );
};

export default AccountNotConnect;
