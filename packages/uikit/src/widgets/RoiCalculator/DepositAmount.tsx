import { useTranslation } from "@pancakeswap/localization";
import { Currency, CurrencyAmount } from "@pancakeswap/sdk";
import { useCallback } from "react";
import styled from "styled-components";

import {
  BalanceInput,
  Text,
  Flex,
  Button,
  Box,
  QuestionHelper,
  RowBetween,
  CurrencyLogo,
  Card,
  CardBody,
} from "../../components";

type Props = UsdAmountInputProps & TokenAmountsDisplayProps;

export function DepositAmountInput({ value, max, onChange, amountA, amountB, currencyA, currencyB }: Props) {
  return (
    <>
      <Box mb="1em">
        <DepositUsdAmountInput value={value} max={max} onChange={onChange} />
      </Box>
      <TokenAmountsDisplay amountA={amountA} amountB={amountB} currencyA={currencyA} currencyB={currencyB} />
    </>
  );
}

const StyledBalanceInput = styled(BalanceInput)`
  padding: 0 16px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

interface UsdAmountInputProps {
  value?: string;
  max?: string;
  onChange?: (val: string) => void;
}

export function DepositUsdAmountInput({
  value = "",
  max = "",
  onChange = () => {
    // default
  },
}: UsdAmountInputProps) {
  const { t } = useTranslation();

  const onMax = useCallback(() => onChange(max), [max, onChange]);

  return (
    <>
      <Box mb="0.5em">
        <StyledBalanceInput value={value} onUserInput={onChange} unit={<Text color="textSubtle">{t("USD")}</Text>} />
      </Box>
      <Flex>
        <Flex flex="3" mr="0.25em">
          <StyledButton variant="tertiary" scale="xs" onClick={() => onChange("100")}>
            $100
          </StyledButton>
        </Flex>
        <Flex flex="3" mr="0.25em">
          <StyledButton variant="tertiary" scale="xs" onClick={() => onChange("1000")}>
            $1,000
          </StyledButton>
        </Flex>
        <Flex flex="4">
          <StyledButton variant="tertiary" scale="xs" mr="0.25em" onClick={onMax}>
            {t("Max")}
          </StyledButton>
          <QuestionHelper text="Tips" />
        </Flex>
      </Flex>
    </>
  );
}

interface TokenAmountsDisplayProps {
  currencyA?: Currency;
  currencyB?: Currency;
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
}

function TokenDisplayRow({ amount, currency }: { amount?: CurrencyAmount<Currency>; currency?: Currency }) {
  if (!currency) {
    return null;
  }

  return (
    <RowBetween>
      <Flex>
        <CurrencyLogo currency={currency} />
        <Text color="textSubtle" ml="0.25em">
          {currency.symbol}
        </Text>
      </Flex>
      <Text>{amount?.toExact() || "0"}</Text>
    </RowBetween>
  );
}

export function TokenAmountsDisplay({ amountA, amountB, currencyA, currencyB }: TokenAmountsDisplayProps) {
  if (!currencyA && !currencyB) {
    return null;
  }

  return (
    <Card>
      <CardBody>
        <Box mb="0.5em">
          <TokenDisplayRow amount={amountA} currency={currencyA} />
        </Box>
        <TokenDisplayRow amount={amountB} currency={currencyB} />
      </CardBody>
    </Card>
  );
}
