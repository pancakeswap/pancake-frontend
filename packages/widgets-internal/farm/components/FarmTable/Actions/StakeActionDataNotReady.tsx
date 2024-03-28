import { useTranslation } from "@pancakeswap/localization";
import { Skeleton, Text } from "@pancakeswap/uikit";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const StakeActionDataNotReady: React.FC<{ bCakeInfoSlot?: React.ReactElement }> = ({ bCakeInfoSlot }) => {
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
      {bCakeInfoSlot}
    </StyledActionContainer>
  );
};

export default StakeActionDataNotReady;
