import { styled } from "styled-components";
import { Button } from "@pancakeswap/uikit";

interface PercentageButtonProps {
  onClick: () => void;
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`;

const PercentageButton: React.FC<React.PropsWithChildren<PercentageButtonProps>> = ({ children, onClick }) => {
  return (
    <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default PercentageButton;
