import { useTranslation } from "@pancakeswap/localization";
import { Balance, Flex, Button, Text } from "@pancakeswap/uikit";
import { ActionContent, ActionTitles } from "./styles";

export interface HarvestActionProps {
  earnings: number;
  earningsBusd: number;
  pendingTx: boolean;
  userDataReady: boolean;
  handleHarvest: () => void;
  disabled?: boolean;
}

const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  earnings,
  earningsBusd,
  pendingTx,
  userDataReady,
  handleHarvest,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <Flex height="100%" flexDirection="column" width="100%">
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          CAKE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Earned")}
        </Text>
      </ActionTitles>
      <ActionContent style={{ height: "100%", alignItems: "flex-start" }}>
        <div>
          <Balance fontSize={20} bold decimals={2} value={earnings} />
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <Button ml="4px" disabled={pendingTx || !userDataReady || disabled} onClick={handleHarvest}>
          {pendingTx ? t("Harvesting") : t("Harvest")}
        </Button>
      </ActionContent>
    </Flex>
  );
};

export default HarvestAction;
