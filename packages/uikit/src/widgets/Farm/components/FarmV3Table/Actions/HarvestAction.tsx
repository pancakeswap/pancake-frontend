import { useTranslation } from "@pancakeswap/localization";
import BigNumber from "bignumber.js";
import { Button } from "../../../../../components/Button";
import { Text } from "../../../../../components/Text";
import { Balance } from "../../../../../components/Balance";
import { ActionContent, ActionTitles } from "./styles";
import Flex from "../../../../../components/Box/Flex";

interface HarvestActionProps {
  earnings: number;
  earningsBusd: number;
  pendingTx: boolean;
  userDataReady: boolean;
  handleHarvest: () => void;
}

const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  earnings,
  earningsBusd,
  pendingTx,
  userDataReady,
  handleHarvest,
}) => {
  const { t } = useTranslation();

  return (
    <Flex height="100%" flexDirection="column">
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          CAKE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Earned")}
        </Text>
      </ActionTitles>
      <ActionContent style={{ height: "100%" }}>
        <div>
          <Balance fontSize={20} bold decimals={2} value={earnings} />
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <Button
          ml="4px"
          disabled={new BigNumber(earnings).eq(0) || pendingTx || !userDataReady}
          onClick={handleHarvest}
        >
          {pendingTx ? t("Harvesting") : t("Harvest")}
        </Button>
      </ActionContent>
    </Flex>
  );
};

export default HarvestAction;
