import { Currency } from "@pancakeswap/sdk";
import { Text, Box, Flex, ArrowForwardIcon } from "@pancakeswap/uikit";
import { CurrencyLogo } from "../components/CurrencyLogo";

interface TokenTransferInfoProps {
  symbolA?: string;
  symbolB?: string;
  amountA: string;
  amountB: string;
  currencyA?: Currency;
  currencyB?: Currency;
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
        <Text mr="4px" fontSize="14px">{`${amountA} ${symbolA}`}</Text>
        <CurrencyLogo size="20px" currency={currencyA} />
      </Flex>
      <Box m="0 8px">
        <ArrowForwardIcon color="textSubtle" />
      </Box>
      <Flex>
        <Text mr="4px" fontSize="14px">{`${amountB} ${symbolB}`}</Text>
        <CurrencyLogo size="20px" currency={currencyB} />
      </Flex>
    </Flex>
  );
};

export default TokenTransferInfo;
