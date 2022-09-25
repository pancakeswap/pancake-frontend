import { AtomBox, AtomBoxProps } from "@pancakeswap/ui";
import styled from "styled-components";

import { Card, CardFooter } from "../../components/Card";
import LiquidityCardHeader from "./LiquidityCardHeader";
import { pageVariants } from "../Swap/SwapWidget.css";

type LiquidityCardProps = AtomBoxProps;

export const CardWrapper = styled(Card)`
  border-radius: 24px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
`;

export const LiquidityCard = ({ children, ...props }: LiquidityCardProps) => (
  <AtomBox className={pageVariants()} {...props}>
    <CardWrapper>{children}</CardWrapper>
  </AtomBox>
);

LiquidityCard.Header = LiquidityCardHeader;
LiquidityCard.Footer = CardFooter;
