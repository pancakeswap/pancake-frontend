import { Button, Text, Flex, Heading, Balance, Pool } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { getBalanceNumber } from "@pancakeswap/utils/formatBalance";
import { useTranslation } from "@pancakeswap/localization";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";

import { ActionContainer, ActionTitles, ActionContent } from "./styles";

export function HarvestAction<T>({
  earningToken,
  userData,
  earningTokenPrice,
  onPresentCollect,
  account,
}: Pool.DeserializedPool<T> & { onPresentCollect: () => void }) {
  const { t } = useTranslation();

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO;
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals);
  const earningTokenDollarBalance = earningTokenPrice
    ? getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
    : 0;
  const hasEarnings = earnings.gt(0);

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {earningToken.symbol}{" "}
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
