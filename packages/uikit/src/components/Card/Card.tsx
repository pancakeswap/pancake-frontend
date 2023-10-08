import React from "react";
import { StyledCard, StyledCardInner } from "./StyledCard";
import { CardProps } from "./types";

const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  ribbon,
  children,
  background,
  innerCardProps,
  ...props
}) => {
  return (
    <StyledCard {...props}>
      <StyledCardInner {...innerCardProps} background={background} hasCustomBorder={!!props.borderBackground}>
        {ribbon}
        {children}
      </StyledCardInner>
    </StyledCard>
  );
};
export default Card;
