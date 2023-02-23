import { ReactNode } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../../../../../components/Text";
import { Button } from "../../../../../components/Button";
import { Link } from "../../../../../components/Link";
import Flex from "../../../../../components/Box/Flex";
import { ActionContainer as ActionContainerSection, ActionContent, ActionTitles } from "./styles";

interface WalletNotConnectedProps {
  account: string;
  boostedAction: ReactNode;
  connectWalletButton: ReactNode;
  hasNoPosition: boolean;
  liquidityUrlPathParts: string;
}

const NoPosition: React.FunctionComponent<React.PropsWithChildren<WalletNotConnectedProps>> = ({
  account,
  hasNoPosition,
  boostedAction,
  connectWalletButton,
  liquidityUrlPathParts,
}) => {
  const { t } = useTranslation();

  return (
    <Flex width="100%" flexDirection={["column-reverse", "column-reverse", "row"]}>
      {boostedAction && <ActionContainerSection style={{ minHeight: 124.5 }}>{boostedAction}</ActionContainerSection>}
      {account && hasNoPosition ? (
        <ActionContainerSection>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t("no position found")}
            </Text>
          </ActionTitles>
          <ActionContent>
            <Link width="100% !important" external href={liquidityUrlPathParts}>
              <Button width="100%">{t("Add Liquidity")}</Button>
            </Link>
          </ActionContent>
        </ActionContainerSection>
      ) : (
        <ActionContainerSection>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t("Start Farming")}
            </Text>
          </ActionTitles>
          <ActionContent>{connectWalletButton}</ActionContent>
        </ActionContainerSection>
      )}
    </Flex>
  );
};

export default NoPosition;
