import { CSSProperties, ReactElement } from "react";
import { BaseCurrency } from "@pancakeswap/swap-sdk-core";
import { useTranslation } from "@pancakeswap/localization";
import styled from "styled-components";
import { AutoColumn, AutoRow, Button, Flex, RowFixed, Text } from "../../components";
import { useMatchBreakpoints } from "../../contexts";
import { ListLogo } from "./ListLogo";

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 10px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? "0.4" : "1")};

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 16px;
  }
`;

const NameOverflow = styled(Flex)`
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
  text-overflow: ellipsis;
  max-width: 210px;
  gap: 8px;
`;

interface CurrencyLogoPropsType<T> {
  currency?: T;
  size?: string;
  style?: React.CSSProperties;
}

export function withCurrencyLogo<T extends BaseCurrency>(
  CurrencyLogo: (props: CurrencyLogoPropsType<T>) => ReactElement
) {
  return ({
    token,
    style,
    dim,
    onCurrencySelect,
    list,
    isActive,
    children,
  }: {
    token: T;
    style?: CSSProperties;
    dim?: boolean;
    onCurrencySelect?: (currency: T) => void;
    list: any;
    isActive: boolean;
    children: ReactElement;
  }) => {
    const { t } = useTranslation();
    const { isMobile } = useMatchBreakpoints();

    return (
      <TokenSection
        style={style}
        variant="text"
        as={isActive && onCurrencySelect ? Button : "a"}
        onClick={() => {
          if (isActive) {
            onCurrencySelect?.(token);
          }
        }}
      >
        <CurrencyLogo currency={token} size={isMobile ? "20px" : "24px"} style={{ opacity: dim ? "0.6" : "1" }} />
        <AutoColumn gap="4px" style={{ opacity: dim ? "0.6" : "1" }}>
          <AutoRow>
            <NameOverflow title={token.name}>
              {token.symbol}
              <Text ellipsis color="textDisabled" fontSize="12px">
                {token.name}
              </Text>
            </NameOverflow>
          </AutoRow>
          {list && list.logoURI && (
            <RowFixed>
              <Text fontSize={isMobile ? "10px" : "14px"} mr="4px" color="textSubtle">
                {t("via")} {list.name}
              </Text>
              <ListLogo logoURI={list.logoURI} size="12px" />
            </RowFixed>
          )}
        </AutoColumn>
        {children}
      </TokenSection>
    );
  };
}
