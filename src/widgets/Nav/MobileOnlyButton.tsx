import styled from "styled-components";
import Button from "../../components/Button";

const MobileOnlyButton = styled(Button)`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

MobileOnlyButton.defaultProps = {
  variant: "text",
  size: "sm",
};

export default MobileOnlyButton;
