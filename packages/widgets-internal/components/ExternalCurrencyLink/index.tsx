import { ReactNode, useCallback } from "react";
import { FlexGap, Text, OpenNewIcon, Link } from "@pancakeswap/uikit";
import { space, SpaceProps } from "styled-system";
import styled from "styled-components";

const LinkCard = styled(FlexGap).attrs({
  gap: "0.5rem",
  justifyContent: "space-between",
  flexDirection: "row",
  alignItems: "flex-start",
})`
  cursor: pointer;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.background};

  ${space}
`;

const Main = styled(FlexGap).attrs({
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.25rem",
  justifyContent: "flex-start",
  flex: 1,
})``;

const TitleContainer = styled(FlexGap).attrs({
  flexDirection: "row",
  alignItems: "center",
  gap: "0.625rem",
  justifyContent: "flex-start",
})``;

export const ExternalCurrencyLinkTitle = styled(Text).attrs({
  bold: true,
  fontSize: "1rem",
  lineHeight: "1.25",
  color: "text",
})``;

export const ExternalCurrencyLinkDesc = styled(Text).attrs({
  fontSize: "0.75rem",
  lineHeight: "1.25",
  color: "textSubtle",
})``;

type Props = {
  currencyLogo?: ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  href?: string;
} & SpaceProps;

export function ExternalCurrencyLink({ currencyLogo, title, desc, href, ...props }: Props) {
  const onLinkClick = useCallback(() => {
    window.open(href, "_blank");
  }, [href]);

  return (
    <LinkCard onClick={onLinkClick} {...props}>
      {currencyLogo}
      <Main>
        <TitleContainer>{title}</TitleContainer>
        {desc}
      </Main>
      <Link external href={href} style={{ alignSelf: "center" }}>
        <OpenNewIcon width="1.5rem" height="1.5rem" color="primary" />
      </Link>
    </LinkCard>
  );
}
