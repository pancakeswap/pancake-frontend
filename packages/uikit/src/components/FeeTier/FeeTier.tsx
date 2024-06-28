import BigNumber from "bignumber.js";
import { forwardRef, useMemo } from "react";
import styled from "styled-components";

export type FeeTierProps = {
  type: string;
  fee: number;
  denominator?: number;
  dynamic?: boolean;
};

export const FeeTier = forwardRef<HTMLSpanElement, FeeTierProps>(
  ({ type, fee, denominator = 10_000, dynamic }, ref) => {
    const percent = useMemo(() => {
      return new BigNumber(fee).div(denominator).times(100).toNumber();
    }, [fee, denominator]);
    return (
      <StyledFeeTier ref={ref}>
        <span style={{ textTransform: "capitalize" }}>{type}</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>
          {dynamic ? <span style={{ marginRight: "2px" }}>↕️</span> : ""}
          {Number(percent.toFixed(2))}%
        </span>
      </StyledFeeTier>
    );
  }
);

const StyledFeeTier = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.tertiary};
  gap: 4px;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
`;
