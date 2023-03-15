import { useTranslation } from "@pancakeswap/localization";
import { Currency, Percent } from "@pancakeswap/sdk";
import { PropsWithChildren, ReactNode, useCallback } from "react";
import styled from "styled-components";
import { SpaceProps } from "styled-system";

import { formatAmount } from "@pancakeswap/utils/formatInfoNumbers";
import { Box, Card, CurrencyLogo, Flex, Row, RowBetween, Table, Tag, TagProps, Td, Text, Th } from "../../components";
import { StyledInput } from "./StyledInput";
import { toSignificant } from "./utils";

export function CardSection({ header, children, ...rest }: { header?: ReactNode } & PropsWithChildren & SpaceProps) {
  return (
    <Box mb="24px" {...rest}>
      <RowBetween mb="12px">{header}</RowBetween>
      {children}
    </Box>
  );
}

export function SectionTitle({ children }: PropsWithChildren) {
  return (
    <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
      {children}
    </Text>
  );
}

interface Props extends SpaceProps {
  assets?: Asset[];
  header?: ReactNode;
  showPrice?: boolean;
  priceEditable?: boolean;
  isActive?: boolean;
  onChange?: (assets: Asset[], info: { index: number }) => void;
  extraRows?: ReactNode;
}

export interface Asset {
  // price in usd
  price: string;

  currency: Currency;

  value: number | string;

  amount: number | string;
}

export function CurrencyLogoDisplay({ logo, name }: { logo?: ReactNode; name?: string }) {
  return (
    <>
      {logo}
      <Text ml="4px">{name}</Text>
    </>
  );
}

export function AssetCardHeader({ children }: PropsWithChildren) {
  return <RowBetween>{children}</RowBetween>;
}

export function AssetCard({
  header,
  showPrice = true,
  priceEditable = true,
  isActive = false,
  assets = [],
  extraRows,
  onChange = () => {
    // default
  },
  ...rest
}: Props) {
  const { t } = useTranslation();

  const assetNodes = assets.map(({ price, value, amount, currency }, index) => (
    <AssetRow
      key={currency.symbol}
      price={price}
      value={value}
      amount={amount}
      showPrice={showPrice}
      priceEditable={priceEditable}
      name={<CurrencyLogoDisplay logo={<CurrencyLogo currency={currency} />} name={currency.symbol} />}
      onPriceChange={(newPrice) =>
        onChange(
          assets.map<Asset>((a, i) => (i === index ? { ...a, price: newPrice } : a)),
          { index }
        )
      }
    />
  ));

  return (
    <Box {...rest}>
      {header && <RowBetween mb="8px">{header}</RowBetween>}
      <Card isActive={isActive} style={{ overflowX: "auto" }}>
        <Table>
          <thead>
            <tr>
              <Th textAlign="left">{t("Asset")}</Th>
              {showPrice && <Th textAlign="left">{t("Price")}</Th>}
              <Th textAlign="left">{t("Balance")}</Th>
              <Th textAlign="left">{t("Value")}</Th>
            </tr>
          </thead>
          <tbody>
            {assetNodes}
            {extraRows}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
}

interface AssetRowProps {
  name: ReactNode;
  amount?: string | number;
  price?: string;
  priceEditable?: boolean;
  decimals?: number;
  value?: string | number;
  showPrice?: boolean;
  onPriceChange?: (price: string) => void;
}

export function AssetRow({
  price = "0",
  value = 0,
  amount,
  decimals = 6,
  name,
  showPrice = true,
  priceEditable = true,
  onPriceChange = () => {
    // default
  },
}: AssetRowProps) {
  const onPriceUpdate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        onPriceChange(e.currentTarget.value.replace(/,/g, ".") || "0");
      }
    },
    [onPriceChange]
  );

  return (
    <tr>
      <Td>
        <Row>{name}</Row>
      </Td>
      {showPrice && (
        <Td style={{ minWidth: "98px" }}>
          <Row>
            <Text>$</Text>
            <StyledInput
              pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
              inputMode="decimal"
              min="0"
              value={price}
              onChange={onPriceUpdate}
              disabled={!priceEditable}
            />
          </Row>
        </Td>
      )}
      <Td>
        <Row>{amount && <Text>{formatAmount(+amount)}</Text>}</Row>
      </Td>
      <Td>
        <Row>
          <Text>${formatAmount(+value)}</Text>
        </Row>
      </Td>
    </tr>
  );
}

interface InterestDisplayProps {
  amount?: number | string;
  interest?: Percent;
}

export function InterestDisplay({ amount, interest }: InterestDisplayProps) {
  return (
    <Flex>
      {amount && <Text bold>${toSignificant(amount)}</Text>}
      {interest && (
        <Text ml="4px" color={interest.lessThan(0) ? "failure" : "success"}>
          ({interest.toSignificant(2)}%)
        </Text>
      )}
    </Flex>
  );
}

interface CardTagProps extends TagProps {
  isActive?: boolean;
}

const ActiveTag = styled(Tag)`
  background: ${({ theme }) => theme.colors.gradientBold};
`;

export function CardTag({ isActive, ...rest }: PropsWithChildren<CardTagProps>) {
  if (isActive) {
    return <ActiveTag {...rest} />;
  }
  return <Tag variant="textSubtle" outline {...rest} />;
}
