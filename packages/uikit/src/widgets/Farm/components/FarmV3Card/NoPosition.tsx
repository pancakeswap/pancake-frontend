import { ReactNode } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { Text } from "../../../../components/Text";
import { Button } from "../../../../components/Button";
import { Link } from "../../../../components/Link";
import Flex from "../../../../components/Box/Flex";

interface NoPositionProps {
  account: string;
  hasNoPosition: boolean;
  boostedAction?: ReactNode;
  connectWalletButton: ReactNode;
  liquidityUrlPathParts: string;
}

const NoPosition: React.FunctionComponent<React.PropsWithChildren<NoPositionProps>> = ({
  account,
  hasNoPosition,
  boostedAction,
  connectWalletButton,
  liquidityUrlPathParts,
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
          <Link width="100% !important" external href={liquidityUrlPathParts}>
            <Button width="100%">{t("Add Liquidity")}</Button>
          </Link>
        </Flex>
      ) : (
        <>{connectWalletButton}</>
      )}
    </Flex>
  );
};

export default NoPosition;
