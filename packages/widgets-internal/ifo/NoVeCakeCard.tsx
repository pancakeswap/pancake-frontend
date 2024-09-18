import { ChainId } from "@pancakeswap/chains";
import { useTranslation } from "@pancakeswap/localization";
import { Box, Button, Flex, Text } from "@pancakeswap/uikit";
import Link from "next/link";
import { ChainLogo } from "./ChainLogo";
import { ChainNameMap, IfoChainId } from "./constants";
import { Divider, GreyCard } from "./styles";

interface NoVeCakeCardProps {
  userChainId?: ChainId;
  nativeChainId?: IfoChainId;
  isConnected?: boolean;
  ConnectWalletButton?: React.ReactNode;

  /**
   * onClick to open network switch modal
   * if userChainId and nativeChainId is not the same
   */
  onClick?: () => void;
}

export const NoVeCakeCard = ({
  nativeChainId = ChainId.BSC,
  userChainId,
  isConnected,
  ConnectWalletButton,
  onClick,
}: NoVeCakeCardProps) => {
  const { t } = useTranslation();

  return (
    <>
      <GreyCard>
        <Flex p="16px 16px 4px" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="cross-chain-vecake" width={38} />
            <ChainLogo ml="-8px" chainId={nativeChainId} />
            <Text ml="6px" fontSize="16px" bold>
              {t("veCAKE on %chainName%", {
                chainName: ChainNameMap[nativeChainId],
              })}
            </Text>
          </Flex>

          <Text bold>0</Text>
        </Flex>

        <Divider />

        <Box p="4px 16px 16px">
          <Text color="textSubtle" small>
            {t("You have no veCAKE at Snapshot time")}
          </Text>
          <br />
          <Text color="textSubtle" small>
            {t("To participate, get veCAKE or extend your veCAKE position beyond the snapshot time.")}
          </Text>

          {!isConnected && ConnectWalletButton ? (
            <>{ConnectWalletButton}</>
          ) : userChainId && userChainId === nativeChainId ? (
            <Button mt="16px" width="100%" as={Link} href="/cake-staking">
              {t("Go to CAKE Staking")}
            </Button>
          ) : (
            <Button mt="16px" width="100%" onClick={() => onClick?.()}>
              {t("Go to CAKE Staking")}
            </Button>
          )}
        </Box>
      </GreyCard>
    </>
  );
};
