import { ChainId } from "@pancakeswap/chains";
import { useTranslation } from "@pancakeswap/localization";
import { Box, BoxProps, Button, Flex, FlexGap, LinkIcon, Tag, Text } from "@pancakeswap/uikit";
import BigNumber, { BigNumber as BN } from "bignumber.js";
import { useMemo } from "react";
import { BalanceDisplay } from "./BalanceDisplay";
import { ChainLogo } from "./ChainLogo";
import { ChainNameMap, IfoChainId } from "./constants";
import { GreyCard } from "./styles";

const SyncedBadge = () => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" scale="sm" style={{ cursor: "default" }}>
      <LinkIcon color="positive10" width="24px" mt="2px" />
      <Text ml="2px" pr="4px" color="invertedContrast" small bold>
        {t("Synced")}
      </Text>
    </Tag>
  );
};

interface CrossChainMyVeCakeProps extends BoxProps {
  veCakeAmount: string | number | BigNumber;
  isVeCakeSynced: boolean;
  chainId?: IfoChainId;
  onClick?: () => void;
}
export const CrossChainMyVeCake = ({
  veCakeAmount,
  isVeCakeSynced,
  chainId = ChainId.ARBITRUM_ONE,
  onClick,
  ...props
}: CrossChainMyVeCakeProps) => {
  const { t } = useTranslation();

  const veCakeAmountNumber = useMemo(() => new BigNumber(veCakeAmount).toNumber(), [veCakeAmount]);

  return (
    <GreyCard p="16px" {...props}>
      <FlexGap gap="8px">
        <Flex alignItems="center">
          <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="cross-chain-vecake" width={38} />
          <ChainLogo ml="-8px" chainId={chainId} />
        </Flex>
        <Box>
          <Text color="textSubtle" fontSize="15px" bold>
            {t("My veCAKE on %chainName%", {
              chainName: ChainNameMap[chainId],
            })}
          </Text>
          <Text mt="-6px" fontSize="24px" color={BN(veCakeAmount).eq(BN("0")) ? "textDisabled" : "text"} bold>
            {BN(veCakeAmount).eq(BN("0")) ? (
              "0.00"
            ) : (
              <BalanceDisplay fontSize="20px" value={veCakeAmountNumber} decimals={2} bold />
            )}
          </Text>
        </Box>
      </FlexGap>

      {isVeCakeSynced && (
        <>
          <Flex my="8px" justifyContent="space-between">
            <Text color="textSubtle">{t("Profile & veCake")}</Text>
            <SyncedBadge />
          </Flex>
        </>
      )}

      <Button mt="8px" width="100%" onClick={() => onClick?.()}>
        {!isVeCakeSynced ? t("Sync veCake") : t("Sync again")}
      </Button>
    </GreyCard>
  );
};
