import { ReactNode } from "react";
import { Currency } from "@pancakeswap/sdk";
import { Spinner, Text, Box, ArrowUpIcon, ColumnCenter, AutoColumn } from "@pancakeswap/uikit";
import TokenTransferInfo from "./TokenTransferInfo";

interface SwapPendingModalContentProps {
  title: string;
  showIcon?: boolean;
  currencyA?: Currency;
  currencyB?: Currency;
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
  children,
}) => {
  const symbolA = currencyA?.symbol;
  const symbolB = currencyB?.symbol;

  return (
    <Box width="100%">
      {showIcon ? (
        <Box margin="auto auto 36px auto" width="fit-content">
          <ArrowUpIcon color="success" width={80} height={80} />
        </Box>
      ) : (
        <Box mb="16px">
          <ColumnCenter>
            <Spinner />
          </ColumnCenter>
        </Box>
      )}
      <AutoColumn gap="12px" justify="center">
        <Text bold textAlign="center">
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
        {children}
      </AutoColumn>
    </Box>
  );
};
