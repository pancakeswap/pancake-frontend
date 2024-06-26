import { MiscellaneousIcon, Text, useTooltip } from "@pancakeswap/uikit";
import { forwardRef, useMemo } from "react";
import styled from "styled-components";

export type FeatureStackProps = {
  features: React.ReactNode[];
  fold?: boolean;
};

const StyledFeatureItem = styled.span`
  display: inline-flex;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
`;

const StyledFeatureItemWithCounts = styled.div`
  display: inline-flex;
`;

const CountsIndicator = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 999px;
  border: 2px solid ${({ theme }) => theme.colors.background};
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  min-width: 24px;
  margin-left: -8px;
`;

const StyledRows = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;
`;

const FeatureItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <StyledFeatureItem>
      <MiscellaneousIcon width={21} height={21} color="secondary" mr="4px" />
      {children}
    </StyledFeatureItem>
  );
};

const FeatureItemWithCounts = forwardRef<HTMLDivElement, React.PropsWithChildren<{ count: number }>>(
  ({ count, children }, ref) => {
    return (
      <StyledFeatureItemWithCounts ref={ref}>
        <FeatureItem>{children}</FeatureItem>
        <CountsIndicator as="span">+{count}</CountsIndicator>
      </StyledFeatureItemWithCounts>
    );
  }
);

const FlattenFeatures: React.FC<FeatureStackProps> = ({ features }) => {
  return (
    <>
      {features.map((feature) => (
        <FeatureItem key={feature?.toString()}>{feature}</FeatureItem>
      ))}
    </>
  );
};

const FoldedFeatures: React.FC<FeatureStackProps> = ({ features }) => {
  const count = useMemo(() => features.length - 1, [features]);
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <StyledRows>
      <FlattenFeatures features={features} />
    </StyledRows>
  );

  return (
    <>
      <FeatureItemWithCounts ref={targetRef} count={count}>
        {features[0]}
      </FeatureItemWithCounts>
      {count > 0 && tooltipVisible && tooltip}
    </>
  );
};

export const FeatureStack: React.FC<FeatureStackProps> = ({ features, fold }) => {
  return fold ? <FoldedFeatures features={features} /> : <FlattenFeatures features={features} />;
};
