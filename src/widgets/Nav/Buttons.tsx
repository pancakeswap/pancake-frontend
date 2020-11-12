import styled from "styled-components";
import Button from "../../components/Button";

const MobileOnlyButton = styled(Button)`
  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;
MobileOnlyButton.defaultProps = {
  variant: "text",
  size: "sm",
};

const MenuButton = styled(Button)`
  padding: 8px;
  border-radius: 8px;
`;
MenuButton.defaultProps = {
  variant: "text",
  size: "sm",
};

export { MobileOnlyButton, MenuButton };
