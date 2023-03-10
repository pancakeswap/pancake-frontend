import { useTranslation } from "@pancakeswap/localization";
import { createElement } from "react";

import { Button, Text, Flex, Heading, Balance } from "../../../components";

import { ActionContainer, ActionTitles, ActionContent } from "./styles";

import { HarvestActionsProps } from "../types";

export const withStakeActionContainer =
  (StakeActionsComp: any, connectWalletButtonElement: any) =>
  ({ account, stakingTokenSymbol, ...props }: { account?: string; stakingTokenSymbol?: string }) => {
    const { t } = useTranslation();

    if (!account) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
              {t("Start staking")}
            </Text>
          </ActionTitles>
          <ActionContent>{createElement(connectWalletButtonElement, { width: "100%" })}</ActionContent>
        </ActionContainer>
      );
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {stakingTokenSymbol}{" "}
          </Text>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t("Staked")}
          </Text>
        </ActionTitles>
        <StakeActionsComp {...props} />
      </ActionContainer>
    );
  };

export function HarvestAction({
  earningTokenPrice,
  onPresentCollect,
  account,
  earningTokenBalance,
  earningTokenDollarBalance,
  earningTokenSymbol,
  earnings,
}: HarvestActionsProps & { account: string; earningTokenSymbol: string }) {
  const { t } = useTranslation();

  const hasEarnings = earnings.gt(0);

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span">
        {earningTokenSymbol}{" "}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t("Earned")}
      </Text>
    </>
  );

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Heading>0</Heading>
          <Button disabled>{t("Harvest")}</Button>
        </ActionContent>
      </ActionContainer>
    );
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <>
            {hasEarnings ? (
              <>
                <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={earningTokenBalance} />
                {Boolean(earningTokenPrice) && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>
        <Button disabled={!hasEarnings} onClick={onPresentCollect}>
          {t("Harvest")}
        </Button>
      </ActionContent>
    </ActionContainer>
  );
}
