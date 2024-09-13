import { ChainId } from "@pancakeswap/chains";
import { useTranslation } from "@pancakeswap/localization";
import {
  Box,
  BoxProps,
  Button,
  Flex,
  FlexGap,
  LinkIcon,
  LinkPlusIcon,
  LinkSlashedIcon,
  Tag,
  Text,
} from "@pancakeswap/uikit";
import BigNumber, { BigNumber as BN } from "bignumber.js";
import { useMemo } from "react";
import { BalanceDisplay } from "./BalanceDisplay";
import { ChainLogo } from "./ChainLogo";
import { ChainNameMap, IfoChainId } from "./constants";
import { Divider, GreyCard, OutlineTag } from "./styles";

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

const ToBeSyncedBadge = () => {
  const { t } = useTranslation();
  return (
    <OutlineTag scale="sm" style={{ cursor: "default" }}>
      <LinkPlusIcon color="primary" width="22px" mt="2px" />
      <Text ml="2px" pr="4px" color="primary" fontSize="13px" bold>
        {t("To be Synced")}
      </Text>
    </OutlineTag>
  );
};

const OutdatedSyncBadge = () => {
  const { t } = useTranslation();
  return (
    <Tag variant="textDisabled" scale="sm" style={{ cursor: "default" }}>
      <LinkSlashedIcon width="16px" mt="2px" mr="4px" />
      <Text ml="2px" pr="4px" color="white" small bold>
        {t("Outdated")}
      </Text>
    </Tag>
  );
};

interface CrossChainMyVeCakeProps extends BoxProps {
  veCakeAmount: string | number | BigNumber;
  isSynced: boolean;
  toBeSynced?: boolean;

  isVeCakeSynced?: boolean;

  chainId?: IfoChainId;
  onClick?: () => void;
}
export const CrossChainMyVeCake = ({
  veCakeAmount,
  isSynced,
  toBeSynced,
  isVeCakeSynced,
  chainId = ChainId.ARBITRUM_ONE,
  onClick,
  ...props
}: CrossChainMyVeCakeProps) => {
  const { t } = useTranslation();

  const veCakeAmountNumber = useMemo(() => new BigNumber(veCakeAmount).toNumber(), [veCakeAmount]);
  const hasPreviouslySynced = useMemo(() => BN(veCakeAmount).gt(BN("0")), [veCakeAmount]);

  return (
    <GreyCard {...props}>
      <FlexGap p="16px 16px 3px" gap="8px">
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
              <BalanceDisplay
                fontSize="20px"
                // Should gray out only if veCake is not synced, not dependent on profile not being synced/inactive or not
                color={!isVeCakeSynced ? "textDisabled" : "text"}
                value={veCakeAmountNumber}
                decimals={veCakeAmountNumber < 1 ? 4 : 2}
                bold
              />
            )}
          </Text>
        </Box>
      </FlexGap>

      <Divider />

      <Box mt="14px" p="0 16px 16px">
        {(isSynced || hasPreviouslySynced || toBeSynced) && (
          <Flex my="8px" justifyContent="space-between">
            <Text color="textSubtle">{t("Profile & veCAKE")}</Text>
            {isSynced ? <SyncedBadge /> : toBeSynced ? <ToBeSyncedBadge /> : <OutdatedSyncBadge />}
          </Flex>
        )}

        <Button mt="8px" width="100%" onClick={() => onClick?.()}>
          {!isSynced && !hasPreviouslySynced ? t("Sync veCAKE") : t("Sync again")}
        </Button>
      </Box>
    </GreyCard>
  );
};
