import { ReactNode } from "react";
import { Currency } from "@pancakeswap/sdk";
import { AutoColumn, ColumnCenter } from "../../components/Column";
import { Spinner, Text, Box, ArrowUpIcon } from "../../components";
import TokenTransferInfo from "./TokenTransferInfo";

interface SwapPendingModalContentProps {
  title: string;
  showIcon?: boolean;
  currencyA: Currency;
  currencyB: Currency;
  amountA: string;
  amountB: string;
  children?: ReactNode;
}

export const SwapPendingModalContent: React.FC<SwapPendingModalContentProps> = ({
  title,
  showIcon,
  currencyA,
  currencyB,
  amountA,
  amountB,
}) => {
  const symbolA = currencyA?.symbol;
  const symbolB = currencyB?.symbol;

  return (
    <Box width="100%" mb="49px">
      {showIcon ? (
        <Box margin="auto" width="fit-content">
          <ArrowUpIcon color="success" width={80} height={80} />
        </Box>
      ) : (
        <ColumnCenter>
          <Spinner />
        </ColumnCenter>
      )}
      <AutoColumn gap="12px" justify="center">
        <Text bold mt="16px" textAlign="center">
          {title}
        </Text>
        <TokenTransferInfo
          symbolA={symbolA}
          symbolB={symbolB}
          amountA={amountA}
          amountB={amountB}
          currencyA={currencyA}
          currencyB={currencyB}
        />
      </AutoColumn>
    </Box>
  );
};
