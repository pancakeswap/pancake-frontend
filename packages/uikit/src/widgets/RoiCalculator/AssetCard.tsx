import { useTranslation } from "@pancakeswap/localization";
import { SpaceProps } from "styled-system";
import { ReactNode, useCallback, useMemo, PropsWithChildren } from "react";
import { CurrencyAmount, Currency } from "@pancakeswap/sdk";

import { Card, Table, Th, Box, Text, Button, RowBetween, Td, CurrencyLogo, Row } from "../../components";
import { NumericalInput } from "../Swap/NumericalInput";

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
  isActive?: boolean;
  onChange?: (assets: Asset[], info: { index: number; asset: Asset }) => void;
}

export interface Asset {
  // price in usd
  price: number;

  amount: CurrencyAmount<Currency>;
}

export function AssetCard({
  header,
  showPrice = true,
  isActive = false,
  assets = [],
  onChange = () => {
    // default
  },
  ...rest
}: Props) {
  const { t } = useTranslation();

  const assetNodes = assets.map((asset, index) => (
    <AssetRow
      key={asset.amount.currency.symbol}
      asset={asset}
      onChange={(newAsset) =>
        onChange(
          assets.map((a, i) => (i === index ? newAsset : a)),
          { index, asset: newAsset }
        )
      }
    />
  ));

  <Button variant="secondary" scale="xs">
    {t("Reset")}
  </Button>;
  return (
    <Box {...rest}>
      {header && <RowBetween mb="8px">{header}</RowBetween>}
      <Card isActive={isActive}>
        <Table>
          <thead>
            <tr>
              <Th textAlign="left">{t("Asset")}</Th>
              {showPrice && <Th textAlign="left">{t("Price")}</Th>}
              <Th textAlign="left">{t("Balance")}</Th>
              <Th textAlign="left">{t("Value")}</Th>
            </tr>
          </thead>
          <tbody>{assetNodes}</tbody>
        </Table>
      </Card>
    </Box>
  );
}

interface AssetRowProps {
  asset: Asset;
  showPrice?: boolean;
  onChange?: (asset: Asset) => void;
}

const toSignificant = (decimal: number | string, significant = 6) => {
  return parseFloat(parseFloat(String(decimal)).toPrecision(significant));
};

function AssetRow({
  asset,
  showPrice = true,
  onChange = () => {
    // default
  },
}: AssetRowProps) {
  const { amount, price } = asset;
  const { currency } = amount;

  const onPriceUpdate = useCallback(
    (newPrice: string) => onChange({ ...asset, price: parseFloat(newPrice) || 0 }),
    [onChange, asset]
  );
  const usdValue = useMemo(() => toSignificant(parseFloat(amount.toExact()) * price), [price, amount]);

  return (
    <tr>
      <Td>
        <Row>
          <CurrencyLogo currency={currency} />
          <Text ml="4px">{currency.symbol}</Text>
        </Row>
      </Td>
      {showPrice && (
        <Td style={{ minWidth: "98px" }}>
          <Row>
            <Text>$</Text>
            <NumericalInput align="left" value={toSignificant(price)} onUserInput={onPriceUpdate} />
          </Row>
        </Td>
      )}
      <Td>
        <Row>
          <Text>{amount.toSignificant(6)}</Text>
        </Row>
      </Td>
      <Td>
        <Row>
          <Text>${usdValue}</Text>
        </Row>
      </Td>
    </tr>
  );
}
