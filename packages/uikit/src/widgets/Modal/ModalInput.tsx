import BigNumber from "bignumber.js";
import { useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { parseUnits } from "@ethersproject/units";
import { formatBigNumber } from "@pancakeswap/utils/formatBalance";
import { trimTrailZero } from "@pancakeswap/utils/trimTrailZero";
import { Flex } from "../../components/Box";
import { Text } from "../../components/Text";
import { Link } from "../../components/Link";
import { Button } from "../../components/Button";
import { Balance } from "../../components/Balance";
import { Input, InputProps } from "../../components/Input";

interface ModalInputProps {
  max: string;
  maxAmount?: BigNumber;
  symbol: string;
  onSelectMax?: () => void;
  onPercentInput?: (percent: number) => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
  valueUSDPrice?: BigNumber;
  addLiquidityUrl?: string;
  inputTitle?: string;
  decimals?: number;
  needEnable?: boolean;
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${({ theme, isWarning }) => (isWarning ? theme.colors.warning : theme.shadows.inset)};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 100%;
`;

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin: 0 8px;
  padding: 0 8px;
  border: none;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 120px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`;

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`;

const ModalInput: React.FC<React.PropsWithChildren<ModalInputProps>> = ({
  max,
  maxAmount,
  symbol,
  onChange,
  onSelectMax,
  onPercentInput,
  value,
  valueUSDPrice,
  addLiquidityUrl,
  inputTitle,
  decimals = 18,
  needEnable,
}) => {
  const { t } = useTranslation();
  const isBalanceZero = max === "0" || !max;

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return "0";
    }

    const balanceUnits = parseUnits(balance, decimals);
    return formatBigNumber(balanceUnits, decimals, decimals);
  };

  const percentAmount = useMemo(
    () => ({
      25: maxAmount ? trimTrailZero(maxAmount.dividedBy(100).multipliedBy(25).toNumber().toFixed(decimals)) : undefined,
      50: maxAmount ? trimTrailZero(maxAmount.dividedBy(100).multipliedBy(50).toNumber().toFixed(decimals)) : undefined,
      75: maxAmount ? trimTrailZero(maxAmount.dividedBy(100).multipliedBy(75).toNumber().toFixed(decimals)) : undefined,
    }),
    [maxAmount, decimals]
  );

  const isAtPercentMax = maxAmount && value === maxAmount.toString();

  return (
    <div style={{ position: "relative" }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{inputTitle}</Text>
          <Text fontSize="14px">{t("Balance: %balance%", { balance: displayBalance(max) })}</Text>
        </Flex>
        <Flex alignItems="flex-end" justifyContent="space-between">
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0"
            value={value}
          />
          <Text fontSize="16px" mb="8px">
            {symbol}
          </Text>
        </Flex>
        {valueUSDPrice && (
          <Flex justifyContent="flex-start" ml="1rem">
            <Flex maxWidth="200px">
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                value={valueUSDPrice.toNumber()}
                unit=" USD"
              />
            </Flex>
          </Flex>
        )}
        <Flex pt="3px" justifyContent="flex-end">
          {maxAmount?.isGreaterThan(0) &&
            onPercentInput &&
            [25, 50, 75].map((percent) => {
              let currentPercentAmount;
              if (percent === 25) currentPercentAmount = percentAmount[25];
              else if (percent === 50) currentPercentAmount = percentAmount[50];
              else if (percent === 75) currentPercentAmount = percentAmount[75];

              const isAtCurrentPercent = maxAmount && value === currentPercentAmount;

              return (
                <Button
                  key={`btn_quickCurrency${percent}`}
                  onClick={() => {
                    onPercentInput(percent);
                  }}
                  scale="xs"
                  mr="5px"
                  variant={isAtCurrentPercent ? "primary" : "secondary"}
                  style={{ textTransform: "uppercase" }}
                >
                  {percent}%
                </Button>
              );
            })}
          {maxAmount?.isGreaterThan(0) && (
            <>
              <Button
                onClick={onSelectMax}
                scale="xs"
                variant={isAtPercentMax ? "primary" : "secondary"}
                style={{ textTransform: "uppercase" }}
              >
                {t("Max")}
              </Button>
            </>
          )}
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          {t("No tokens to stake")}:{" "}
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {t("Get %symbol%", { symbol })}
          </Link>
        </StyledErrorMessage>
      )}
      {needEnable && (
        <Text color="failure" fontSize="12px" mt="8px">
          {t('Insufficient token allowance. Click "Enable" to approve.')}
        </Text>
      )}
    </div>
  );
};

export default ModalInput;
