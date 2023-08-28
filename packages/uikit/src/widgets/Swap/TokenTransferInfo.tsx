import { Currency } from "@pancakeswap/sdk";
import { Text, Box, Flex, ArrowForwardIcon, CurrencyLogo } from "../../components";

interface TokenTransferInfoProps {
  symbolA: string;
  symbolB: string;
  amountA: string;
  amountB: string;
  currencyA: Currency;
  currencyB: Currency;
}

const TokenTransferInfo: React.FC<TokenTransferInfoProps> = ({
  symbolA,
  symbolB,
  amountA,
  amountB,
  currencyA,
  currencyB,
}) => {
  return (
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
  );
};

export default TokenTransferInfo;
