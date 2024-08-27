import { getChainName } from "@pancakeswap/chains";
import { useTheme } from "@pancakeswap/hooks";
import { useTranslation } from "@pancakeswap/localization";
import { Currency, ERC20Token } from "@pancakeswap/sdk";
import { Column, IMultiSelectChangeEvent, IMultiSelectProps, ISelectItem, MultiSelect } from "@pancakeswap/uikit";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { CurrencyLogo } from "../CurrencyLogo";

export interface ITokenProps {
  data?: ERC20Token[];
  value?: IMultiSelectProps<string>["value"];
  onChange?: (e: IMultiSelectChangeEvent) => void;
}

const Container = styled.div`
  flex: 1;
  /* hack:
   * the primereact not support to custom the placement of panel
   * we need to place fixed to bottom
   * */
  .p-multiselect-panel {
    top: 0 !important;
    transform-origin: center top !important;
  }
`;
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & img {
    width: 40px;
    height: 40px;
  }
`;

const ItemTitle = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 24px;
`;

const ItemDesc = styled.div`
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const ItemSymbol = styled.span`
  font-size: 16px;
  font-weight: 600;
  margin-right: 4px;
`;

const ItemName = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

export const toTokenValue = (t: Currency) => `${t.chainId}:${t.wrapped.address}`;

export const TokenFilter: React.FC<ITokenProps> = ({ data = [], value, onChange }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const tokenList = useMemo(
    () =>
      data.map((token) => ({
        ...token,
        icon: <CurrencyLogo currency={token} />,
        value: toTokenValue(token),
        label: token.symbol,
      })),
    [data]
  );

  const itemTemplate = useCallback((option: ISelectItem<string> & ERC20Token) => {
    return (
      <ItemContainer>
        <Column style={{ width: "40px" }}>{option.icon}</Column>
        <Column>
          <ItemTitle>
            <ItemSymbol>{option.label}</ItemSymbol>
            <ItemName>{option.name}</ItemName>
          </ItemTitle>
          <ItemDesc>{getChainName(option.chainId)}</ItemDesc>
        </Column>
      </ItemContainer>
    );
  }, []);

  return (
    <Container>
      <MultiSelect
        style={{
          background: theme.colors.input,
        }}
        panelStyle={{
          minHeight: "382px",
          minWidth: "328px",
        }}
        scrollHeight="382px"
        options={tokenList}
        isShowFilter
        placeholder="All tokens"
        panelFooterTemplate={() => <span>{t("Don’t see expected tokens?")}</span>}
        virtualScrollerOptions={{ itemSize: 58 }}
        itemTemplate={itemTemplate}
        value={value}
        onChange={onChange}
      />
    </Container>
  );
};
