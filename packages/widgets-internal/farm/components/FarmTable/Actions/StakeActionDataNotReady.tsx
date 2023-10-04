import { useTranslation } from "@pancakeswap/localization";
import { Text, Skeleton } from "@pancakeswap/uikit";
import { StyledActionContainer, ActionContent, ActionTitles } from "./styles";

const StakeActionDataNotReady = () => {
  const { t } = useTranslation();
  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Start Farming")}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Skeleton width={180} marginBottom={28} marginTop={14} />
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakeActionDataNotReady;
