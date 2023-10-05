import { useTranslation } from "@pancakeswap/localization";
import { formatNumber } from "@pancakeswap/utils/formatBalance";
import { useTheme } from "styled-components";

import { Flex, Heading, Button, Text, AutoRenewIcon, Modal } from "@pancakeswap/uikit";
import getThemeValue from "@pancakeswap/uikit/util/getThemeValue";

export interface CollectModalProps {
  formattedBalance: string;
  fullBalance: string;
  earningTokenSymbol: string;
  earningsDollarValue: number;
  sousId: number;
  isBnbPool: boolean;
  onDismiss?: () => void;
  poolAddress?: string;
  earningTokenAddress?: string;
}

export interface CollectModalWithHandlerProps extends Omit<CollectModalProps, "isBnbPool" | "sousId"> {
  handleHarvestConfirm: () => Promise<any>;
  pendingTx: boolean;
}

export function CollectModal({
  formattedBalance,
  earningTokenSymbol,
  earningsDollarValue,
  onDismiss,
  handleHarvestConfirm,
  pendingTx,
}: CollectModalWithHandlerProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Modal
      title={`${earningTokenSymbol} ${t("Harvest")}`}
      onDismiss={onDismiss}
      headerBackground={getThemeValue(theme, "colors.gradientCardHeader")}
    >
      <Flex justifyContent="space-between" alignItems="center" mb="8px">
        <Text>{t("Harvesting")}:</Text>
      </Flex>
      <Flex flexDirection="column" mb="24px">
        <Heading>
          {formattedBalance} {earningTokenSymbol}
        </Heading>
        {earningsDollarValue > 0 && (
          <Text fontSize="12px" color="textSubtle">{`~${formatNumber(earningsDollarValue)} USD`}</Text>
        )}
      </Flex>

      <Button
        mt="8px"
        onClick={handleHarvestConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {pendingTx ? t("Confirming") : t("Confirm")}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        {t("Close Window")}
      </Button>
    </Modal>
  );
}
