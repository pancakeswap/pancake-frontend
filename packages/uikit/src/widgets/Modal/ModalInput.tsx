import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { parseUnits } from "@ethersproject/units";
import { formatBigNumber } from "@pancakeswap/utils/formatBalance";
import { Flex } from "../../components/Box";
import { Text } from "../../components/Text";
import { Link } from "../../components/Link";
import { Button } from "../../components/Button";
import { Input, InputProps } from "../../components/Input";

interface ModalInputProps {
  max: string;
  symbol: string;
  onSelectMax?: () => void;
  onPercentInput?: (percent: number) => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
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
  symbol,
  onChange,
  onSelectMax,
  onPercentInput,
  value,
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
        <Flex pt="3px" justifyContent="flex-end">
          {onPercentInput &&
            [25, 50, 75].map((percent) => (
              <Button
                key={`btn_quickCurrency${percent}`}
                onClick={() => {
                  onPercentInput(percent);
                }}
                scale="xs"
                mr="5px"
                variant="secondary"
                style={{ textTransform: "uppercase" }}
              >
                {percent}%
              </Button>
            ))}
          <Button onClick={onSelectMax} scale="xs" variant="secondary" style={{ textTransform: "uppercase" }}>
            {t("Max")}
          </Button>
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
