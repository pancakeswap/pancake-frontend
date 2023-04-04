import { ReactNode } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../../../../components/Text";
import { Button } from "../../../../components/Button";
import Flex from "../../../../components/Box/Flex";

interface NoPositionProps {
  inactive: boolean;
  account: string;
  hasNoPosition: boolean;
  boostedAction?: ReactNode;
  connectWalletButton: ReactNode;
  onAddLiquidityClick: () => void;
}

const NoPosition: React.FunctionComponent<React.PropsWithChildren<NoPositionProps>> = ({
  inactive,
  account,
  hasNoPosition,
  boostedAction,
  connectWalletButton,
  onAddLiquidityClick,
}) => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column">
      {boostedAction && <>{boostedAction}</>}
      {account && hasNoPosition ? (
        <Flex flexDirection="column">
          <Text color="textSubtle" bold textTransform="uppercase" fontSize="12px" mb="8px">
            {t("no position found")}
          </Text>
          {!inactive && (
            <Button width="100%" onClick={onAddLiquidityClick}>
              {t("Add Liquidity")}
            </Button>
          )}
        </Flex>
      ) : (
        <>{connectWalletButton}</>
      )}
    </Flex>
  );
};

export default NoPosition;
