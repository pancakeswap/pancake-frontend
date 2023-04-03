import { useTranslation } from "@pancakeswap/localization";
import { Currency, Percent } from "@pancakeswap/sdk";
import { memo, PropsWithChildren, ReactNode, useCallback } from "react";
import styled from "styled-components";
import { SpaceProps } from "styled-system";
import { formatAmount } from "@pancakeswap/utils/formatInfoNumbers";

import {
  Flex,
  Box,
  Card,
  CurrencyLogo,
  Row,
  RowBetween,
  RowFixed,
  Table,
  Td,
  Text,
  Th,
  PencilIcon,
} from "../../components";
import { Tag, TagProps } from "../../components/Tag";
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

  priceChanged?: boolean;
}

export const CurrencyLogoDisplay = memo(function CurrencyLogoDisplay({
  logo,
  name,
}: {
  logo?: ReactNode;
  name?: string;
}) {
  return (
    <Flex>
      <Flex flexShrink="0" alignItems="center">
        {logo}
      </Flex>
      <Text ml="4px" style={{ whiteSpace: "nowrap" }}>
        {name}
      </Text>
    </Flex>
  );
});

export function AssetCardHeader({ children }: PropsWithChildren) {
  return <RowBetween>{children}</RowBetween>;
}

export const AssetCard = memo(function AssetCard({
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

  const assetNodes = assets.map(({ price, value, amount, currency, priceChanged }, index) => (
    <AssetRow
      key={currency.symbol}
      price={price}
      value={value}
      amount={amount}
      showPrice={showPrice}
      priceEditable={priceEditable}
      priceChanged={priceChanged}
      name={<CurrencyLogoDisplay logo={<CurrencyLogo currency={currency} />} name={currency.symbol} />}
      onPriceChange={(newPrice) =>
        onChange(
          assets.map<Asset>((a, i) => (i === index ? { ...a, price: newPrice, priceChanged: true } : a)),
          { index }
        )
      }
    />
  ));

  return (
    <Box {...rest}>
      {header && <RowBetween mb="8px">{header}</RowBetween>}
      <Card isActive={isActive} style={{ overflowX: "auto" }}>
        <Table style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col />
            {showPrice && <col width="30%" />}
            <col />
            <col />
          </colgroup>
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
});

interface AssetRowProps {
  name: ReactNode;
  amount?: string | number;
  price?: string;
  priceChanged?: boolean;
  priceEditable?: boolean;
  decimals?: number;
  value?: string | number;
  showPrice?: boolean;
  onPriceChange?: (price: string) => void;
}

export const AssetRow = memo(function AssetRow({
  price = "0",
  value = 0,
  amount,
  decimals = 6,
  name,
  showPrice = true,
  priceChanged = false,
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

  const textColor = priceChanged ? "primary" : "textSubtle";

  return (
    <tr>
      <Td>
        <Row>{name}</Row>
      </Td>
      {showPrice && (
        <Td style={{ minWidth: "98px" }}>
          <Row>
            <Text color={textColor}>$</Text>
            <StyledInput
              pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
              inputMode="decimal"
              min="0"
              color={textColor}
              value={price}
              onChange={onPriceUpdate}
              disabled={!priceEditable}
            />
            {priceChanged && <PencilIcon width="10px" color="primary" ml="0.25em" />}
          </Row>
        </Td>
      )}
      <Td>
        <Row>{amount && <Text ellipsis>{formatAmount(+amount)}</Text>}</Row>
      </Td>
      <Td>
        <Row>
          <Text ellipsis>${formatAmount(+value)}</Text>
        </Row>
      </Td>
    </tr>
  );
});

interface InterestDisplayProps {
  amount?: number | string;
  interest?: Percent | typeof Infinity;
}

export const InterestDisplay = memo(function InterestDisplay({ amount, interest }: InterestDisplayProps) {
  return (
    <RowFixed
      display="grid"
      style={{
        gridTemplateColumns: "auto auto",
      }}
    >
      {amount && (
        <Text bold ellipsis>
          ${toSignificant(amount)}
        </Text>
      )}
      {interest && (
        <Text
          ml="4px"
          color={typeof interest === "number" ? "success" : interest.lessThan(0) ? "failure" : "success"}
          ellipsis
        >
          (
          {typeof interest === "number"
            ? formatAmount(interest)
            : parseFloat(interest.toSignificant(18)).toLocaleString("en", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
          %)
        </Text>
      )}
    </RowFixed>
  );
});

interface CardTagProps extends TagProps {
  isActive?: boolean;
}

const ActiveTag = styled(Tag)`
  background: ${({ theme }) => theme.colors.gradientBold};
`;

export const CardTag = memo(function CardTag({ isActive, ...rest }: PropsWithChildren<CardTagProps>) {
  if (isActive) {
    return <ActiveTag {...rest} />;
  }
  return <Tag variant="textSubtle" outline {...rest} />;
});
