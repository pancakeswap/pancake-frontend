import { AtomBox, AtomBoxProps } from "@pancakeswap/ui";
import styled from "styled-components";

import { Card, CardBody, CardFooter } from "../../components/Card";
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
  <>
    <AtomBox className={pageVariants({ noMinHeight: true })} {...props}>
      <CardWrapper>{children}</CardWrapper>
    </AtomBox>
  </>
);

const ListBody = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`;

LiquidityCard.ListBody = ListBody;
LiquidityCard.Header = LiquidityCardHeader;
LiquidityCard.Footer = CardFooter;
