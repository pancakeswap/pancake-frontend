import { Flex, Skeleton, Text, Balance } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import BigNumber from "bignumber.js";
import { BaseCell, CellContent } from "./BaseCell";

interface TotalStakedCellProps<T> {
  totalStakedBalance: number;
  stakingToken: T;
  totalStaked: BigNumber;
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`;

export function TotalStakedCell<T>({ stakingToken, totalStaked, totalStakedBalance }: TotalStakedCellProps<T>) {
  const { t } = useTranslation();

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t("Total staked")}
        </Text>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  );
}
