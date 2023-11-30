import { useTranslation } from "@pancakeswap/localization";
import { Balance, FlexGap, Text } from "@pancakeswap/uikit";
import { getBalanceNumber } from "@pancakeswap/utils/formatBalance";
import { PropsWithChildren, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import Image from "next/image";

const Container = styled(FlexGap)`
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  padding: 0.75rem 1rem;
`;

export function MyVeCake({ amount = 0 }: PropsWithChildren<{ amount?: number | BigNumber }>) {
  const { t } = useTranslation();
  const balanceNumber = useMemo(() => new BigNumber(amount).toNumber(), [amount]);
  const decimals = useMemo(() => (balanceNumber % 1 === 0 ? 0 : 2), [balanceNumber]);

  return (
    <Container alignItems="center" gap="0.5rem">
      <Image src="/images/cake-staking/token-vecake.png" alt="token-vecake" width={40} height={40} />
      <FlexGap
        flex="1"
        flexDirection={["column", "column", "row"]}
        justifyContent="space-between"
        gap="0.5rem"
        alignItems="center"
      >
        <Text fontSize="1.25rem" bold lineHeight="1.375rem" color="white">
          {t("veCAKE")}
        </Text>
        <Balance fontSize="1.25rem" bold color="white" value={balanceNumber} decimals={decimals} />
      </FlexGap>
    </Container>
  );
}
