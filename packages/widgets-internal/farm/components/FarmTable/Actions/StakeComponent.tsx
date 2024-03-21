import { useTranslation } from "@pancakeswap/localization";
import { Button, Text } from "@pancakeswap/uikit";
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

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
          {t("Stake")}
        </Text>
        <Text bold color="secondary" fontSize="12px">
          {lpSymbol}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" onClick={onPresentDeposit} variant="secondary" disabled={isStakeReady}>
          {t("Stake LP")}
        </Button>
      </ActionContent>
      {bCakeInfoSlot}
    </StyledActionContainer>
  );
};

export default StakeComponent;
