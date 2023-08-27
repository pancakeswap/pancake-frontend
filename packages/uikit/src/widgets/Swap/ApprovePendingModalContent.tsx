import { useTranslation } from "@pancakeswap/localization";
import { Currency } from "@pancakeswap/sdk";
import { AutoColumn, ColumnCenter } from "../../components/Column";
import { Spinner, Text, Box, Flex, ArrowForwardIcon, CurrencyLogo } from "../../components";

interface ApprovePendingModalContentProps {
  currencyA: Currency;
  currencyB: Currency;
  amountA: string;
  amountB: string;
}

export const ApprovePendingModalContent: React.FC<ApprovePendingModalContentProps> = ({
  currencyA,
  currencyB,
  amountA,
  amountB,
}) => {
  const { t } = useTranslation();
  const symbolA = currencyA?.symbol;
  const symbolB = currencyB?.symbol;

  return (
    <Box width="100%" mb="49px">
      <ColumnCenter>
        <Spinner />
      </ColumnCenter>
      <AutoColumn gap="12px" justify="center">
        <Text bold mt="16px" textAlign="center">
          {t("Allow %symbol% to be used for swapping", { symbol: symbolA })}
        </Text>
        <Flex>
          <Flex>
            <Text mr="4px" fontSize="14px" bold>{`${amountA} ${symbolA}`}</Text>
            <CurrencyLogo size="20px" currency={currencyA} />
          </Flex>
          <Box m="0 8px">
            <ArrowForwardIcon color="textSubtle" />
          </Box>
          <Flex>
            <Text mr="4px" fontSize="14px" bold>{`${amountB} ${symbolB}`}</Text>
            <CurrencyLogo size="20px" currency={currencyB} />
          </Flex>
        </Flex>
      </AutoColumn>
    </Box>
  );
};
