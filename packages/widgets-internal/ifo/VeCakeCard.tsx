import { styled } from "styled-components";
import { Card, CardHeader, Flex, Text, QuestionHelper, FlexGap, CardBody } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { BigNumber } from "bignumber.js";
import Image from "next/image";

import { BalanceDisplay } from "./BalanceDisplay";

const StyledCard = styled(Card)`
  min-width: 280px;
  max-width: 100%;
  margin: 0 0 1.5em 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ theme }) => theme.colors.secondary};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`;

const StyledCardHeader = styled(CardHeader)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`;

function Header({ children }: PropsWithChildren) {
  return (
    <StyledCardHeader>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </StyledCardHeader>
  );
}

export function MyICake({ amount = 0 }: { amount?: number | BigNumber }) {
  const { t } = useTranslation();
  const hasICake = useMemo(() => Number(amount.toString()) > 0, [amount]);
  const color = hasICake ? "secondary" : "failure";

  return (
    <FlexGap gap="0.25rem" flexDirection="column" justifyContent="flex-start">
      <Text fontSize="1.25rem" lineHeight="1.375rem" bold>
        {t("My iCAKE")}
      </Text>
      <FlexGap gap="0.25rem" alignItems="center">
        <BalanceDisplay
          fontSize="1.5rem"
          bold
          value={Number(amount.toString())}
          decimals={2}
          lineHeight="1.75rem"
          color={color}
        />
        <QuestionHelper
          size="1.375rem"
          text={t(
            "Your available iCAKE is calculated with the veCAKE balance at the snapshot time, multiplied by a fixed ratio."
          )}
          color={color}
          placement="top-start"
        />
      </FlexGap>
    </FlexGap>
  );
}

export function IfoSalesLogo({ hasICake, size = 60 }: { hasICake?: boolean; size?: number }) {
  return (
    <Image
      alt="ifo sales logo"
      src={`/images/ifos/assets/${hasICake ? "ifo-sales-active" : "ifo-sales"}.png`}
      width={size}
      height={size}
    />
  );
}

type VeCakeCardProps = PropsWithChildren<{
  header?: ReactNode;
}>;

export function VeCakeCard({ header, children }: VeCakeCardProps) {
  return (
    <StyledCard isActive>
      <Header>{header}</Header>
      <CardBody>{children}</CardBody>
    </StyledCard>
  );
}
