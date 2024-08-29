import { CalculateIcon, Flex, IconButton } from "@pancakeswap/uikit";
import { useCallback } from "react";
import { styled } from "styled-components";

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
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (hideButton) return;
      handleClickButton(event);
    },
    [hideButton, handleClickButton]
  );

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <ApyLabelContainer
        alignItems="center"
        style={{ textDecoration: strikethrough ? "line-through" : "initial" }}
        onClick={handleClick}
      >
        {variant === "text-and-button" && (
          <IconButton variant="text" scale="xs" ml="4px" style={{ height: "auto", padding: 0 }}>
            <CalculateIcon width="18px" color="textSubtle" />
          </IconButton>
        )}
        {children}
      </ApyLabelContainer>
    </Flex>
  );
};
