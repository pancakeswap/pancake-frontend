import { PropsWithChildren, ReactNode } from "react";
import { styled } from "styled-components";
import { FlexGap, Text, CheckmarkIcon, ErrorIcon, CircleLoader } from "@pancakeswap/uikit";

import { LightGreyCard } from "../Card";

export type TransactionListItemProps = PropsWithChildren<{
  status?: TransactionStatus;
  title?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
}>;

export enum TransactionStatus {
  Pending,
  Success,
  Failed,
  Expired,
}

export const TransactionListItemTitle = styled(Text).attrs({
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
})`
  color: ${({ theme }) => theme.colors.textSubtle};
`;

export const TransactionListItemDesc = styled(Text).attrs({
  fontSize: "1rem",
  color: "text",
})``;

export function TransactionListItem({ status, onClick, children, action, title }: TransactionListItemProps) {
  return (
    <LightGreyCard padding="1rem">
      <FlexGap flexDirection="row" justifyContent="space-between" alignItems="center" gap="0.5rem">
        <FlexGap flexDirection="column" gap="0.5rem" alignItems="flex-start">
          {title}
          <FlexGap
            flexDirection="row"
            gap="0.5rem"
            alignItems="center"
            justifyContent="flex-start"
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "unset" }}
          >
            <StatusIndicator status={status} />
            {children}
          </FlexGap>
        </FlexGap>
        {action}
      </FlexGap>
    </LightGreyCard>
  );
}

function StatusIndicator({ status }: Pick<TransactionListItemProps, "status">) {
  if (status === TransactionStatus.Success) {
    return <CheckmarkIcon color="success" />;
  }
  if (status === TransactionStatus.Pending) {
    return <CircleLoader size="20px" />;
  }
  if (status === TransactionStatus.Failed) {
    return <ErrorIcon color="failure" />;
  }
  return null;
}
