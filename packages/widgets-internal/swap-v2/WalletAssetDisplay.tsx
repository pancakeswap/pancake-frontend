import { MotionBox, Text, WalletFilledV2Icon } from "@pancakeswap/uikit";
import { memo } from "react";
import { styled } from "styled-components";

const StyledText = styled(Text)`
  font-size: 12px;
  font-weight: 600;
`;

const Wrapper = styled(MotionBox)`
  position: absolute;
  top: 0;
  right: 0px;
  display: flex;
  gap: 2px;
  transition: opacity 0.2s ease-in, transform 0.2s ease-in-out;
  &.clickable {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
      transform: scale(1.02);
    }
    &:active {
      transform: scale(1);
    }
  }
`;

export const WalletAssetDisplay: React.FC<{
  onMax?: () => void;
  balance?: string;
  isUserInsufficientBalance?: boolean;
}> = memo(({ balance, onMax, isUserInsufficientBalance }) => {
  return (
    <Wrapper
      key="WalletAssetDisplay"
      initial={{ x: -2, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.05, delay: 0.2 } }}
      exit={{ x: 2, opacity: 0 }}
      className={onMax ? "clickable" : undefined}
      onClick={onMax}
    >
      <WalletFilledV2Icon color={isUserInsufficientBalance ? "#D14293" : "textSubtle"} width="16px" />
      <StyledText color={isUserInsufficientBalance ? "#D14293" : "textSubtle"}>{balance}</StyledText>
    </Wrapper>
  );
});
