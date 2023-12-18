import { FarmMultiplierInfo, HelpIcon, Skeleton, useTooltip } from "@pancakeswap/uikit";
import { styled } from "styled-components";
import { FarmTableMultiplierProps } from "../../types";

const ReferenceElement = styled.div`
  display: inline-block;
`;

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  text-align: right;
  margin-right: 4px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Multiplier: React.FunctionComponent<React.PropsWithChildren<FarmTableMultiplierProps>> = ({
  multiplier,
  farmCakePerSecond,
  totalMultipliers,
}) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />;

  const tooltipContent = FarmMultiplierInfo({
    farmCakePerSecond: farmCakePerSecond ?? "-",
    totalMultipliers: totalMultipliers ?? "-",
  });
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: "top-end",
    tooltipOffset: [20, 10],
  });

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  );
};

export default Multiplier;
