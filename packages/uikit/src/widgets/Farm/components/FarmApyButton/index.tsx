import styled from "styled-components";
import { Flex } from "../../../../components/Box";
import { CalculateIcon } from "../../../../components/Svg";
import { IconButton } from "../../../../components/Button";

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

interface FarmApyButtonProps {
  hideButton?: boolean;
  strikethrough?: boolean;
  variant: "text" | "text-and-button";
  handleClickButton: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const FarmApyButton: React.FC<React.PropsWithChildren<FarmApyButtonProps>> = ({
  hideButton,
  variant,
  strikethrough,
  handleClickButton,
  children,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (hideButton) return;
    handleClickButton(event);
  };

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <ApyLabelContainer
        alignItems="center"
        style={{ textDecoration: strikethrough ? "line-through" : "initial" }}
        onClick={handleClick}
      >
        {children}
        {variant === "text-and-button" && (
          <IconButton variant="text" scale="sm" ml="4px">
            <CalculateIcon width="18px" />
          </IconButton>
        )}
      </ApyLabelContainer>
    </Flex>
  );
};
