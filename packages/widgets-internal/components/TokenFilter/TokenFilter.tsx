import { ChainId, getChainName as defaultGetChainName } from "@pancakeswap/chains";
import { useTheme } from "@pancakeswap/hooks";
import { Currency, ERC20Token } from "@pancakeswap/sdk";
import { getTokenByAddress } from "@pancakeswap/tokens";
import { Column, IMultiSelectChangeEvent, IMultiSelectProps, ISelectItem, MultiSelect } from "@pancakeswap/uikit";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Address } from "viem";
import { CurrencyLogo } from "../CurrencyLogo";

export interface ITokenProps {
  data?: ERC20Token[];
  value?: IMultiSelectProps<string>["value"];
  onChange?: (e: IMultiSelectChangeEvent) => void;
  getChainName?: (chainId: number) => string | undefined;
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
`;

const ItemLogoContainer = styled.div`
  width: 40px;
  height: 40px;

  & img:first-child {
    width: 100%;
    height: 100%;
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

export const toTokenValueByCurrency = (t: Currency) => `${t.chainId}:${t.wrapped.address}`;
export const toTokenValue = (t: { chainId: number; address: Address }) => `${t.chainId}:${t.address}`;

const CurrencyLogoContainer = styled.div`
  position: relative;
  display: inline-flex;
`;
const StyledChainLogo = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40%;
  height: 40%;
`;
const CurrencyLogoWithChain = ({ currency }: { currency: ERC20Token }) => (
  <CurrencyLogoContainer>
    <CurrencyLogo currency={currency} />
    <StyledChainLogo
      alt={`chain-${currency.chainId}`}
      src={`https://assets.pancakeswap.finance/web/chains/${currency.chainId}.png`}
    />
  </CurrencyLogoContainer>
);

export const TokenFilter: React.FC<ITokenProps> = ({
  data = [],
  value,
  onChange,
  getChainName = defaultGetChainName,
}) => {
  const { theme } = useTheme();

  const selectedTokensNotInData = useMemo(
    () =>
      value
        ? (value
            .map((tokenValue) => {
              const [chainId, address] = tokenValue.split(":");
              if (data.find((token_) => token_.chainId === Number(chainId) && token_.address === address)) {
                return null;
              }
              return getTokenByAddress(chainId as unknown as ChainId, address as Address);
            })
            .filter(Boolean) as ERC20Token[])
        : [],
    [value, data]
  );

  const tokenList = useMemo(
    () =>
      selectedTokensNotInData.concat(data).map((token) => ({
        ...token,
        icon: <CurrencyLogoWithChain currency={token} />,
        value: toTokenValueByCurrency(token),
        label: token.symbol,
        key: toTokenValue(token),
      })),
    [data, selectedTokensNotInData]
  );

  const itemTemplate = useCallback(
    (option: ISelectItem<string> & ERC20Token) => {
      return (
        <ItemContainer>
          <ItemLogoContainer>{option.icon}</ItemLogoContainer>
          <Column>
            <ItemTitle>
              <ItemSymbol>{option.label}</ItemSymbol>
              <ItemName>{option.name}</ItemName>
            </ItemTitle>
            <ItemDesc>{getChainName(option.chainId)}</ItemDesc>
          </Column>
        </ItemContainer>
      );
    },
    [getChainName]
  );

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
        virtualScrollerOptions={{ itemSize: 58 }}
        itemTemplate={itemTemplate}
        value={value}
        onChange={onChange}
      />
    </Container>
  );
};
