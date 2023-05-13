import styled from "styled-components";
import { Placement, useTooltip } from "../../hooks";
import { BoxProps, Flex } from "../Box";
import { HelpIcon } from "../Svg";

interface Props extends BoxProps {
  text: string | React.ReactNode;
  placement?: Placement;
  size?: string;
  color?: string;
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`;

export const QuestionHelper: React.FC<React.PropsWithChildren<Props>> = ({
  text,
  placement = "right-end",
  size = "16px",
  color,
  ...props
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement });

  return (
    <Flex alignItems="center" {...props} ref={targetRef}>
      {tooltipVisible && tooltip}
      <QuestionWrapper as={Flex} alignItems="center">
        <HelpIcon color={color || "textSubtle"} width={size} />
      </QuestionWrapper>
    </Flex>
  );
};
