import { useTranslation } from "@pancakeswap/localization";
import { space, SpaceProps } from "styled-system";
import styled from "styled-components";
import { ReactNode, useCallback, useMemo } from "react";
import { CurrencyAmount, Currency } from "@pancakeswap/sdk";

import { Card, Table, Th, Box, Text, Button, RowBetween, Td, CurrencyLogo, Row } from "../../components";
import { NumericalInput } from "../Swap/NumericalInput";

interface Props extends SpaceProps {
  title?: ReactNode;
  assets?: Asset[];
  onChange?: (assets: Asset[], info: { index: number; asset: Asset }) => void;
}

export interface Asset {
  // price in usd
  price: number;

  amount: CurrencyAmount<Currency>;
}

function AssetCardComp({
  title,
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

  return (
    <Box mb="24px" {...rest}>
      <RowBetween mb="12px">
        <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
          {title}
        </Text>
        <Button variant="secondary" scale="xs">
          {t("Reset")}
        </Button>
      </RowBetween>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th textAlign="left">{t("Asset")}</Th>
              <Th textAlign="left">{t("Price")}</Th>
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
  onChange?: (asset: Asset) => void;
}

const toSignificant = (decimal: number | string, significant = 6) => {
  return parseFloat(parseFloat(String(decimal)).toPrecision(significant));
};

function AssetRow({
  asset,
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
      <Td style={{ minWidth: "98px" }}>
        <Row>
          <Text>$</Text>
          <NumericalInput align="left" value={toSignificant(price)} onUserInput={onPriceUpdate} />
        </Row>
      </Td>
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

export const AssetCard = styled(AssetCardComp)<SpaceProps>`
  ${space}
`;
