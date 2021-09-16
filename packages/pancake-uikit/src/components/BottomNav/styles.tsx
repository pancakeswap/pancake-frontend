import styled from "styled-components";
import { Flex } from "../Box";

const StyledBottomNavItem = styled(Flex)`
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 5px 8px;
  padding-bottom: env(safe-area-inset-bottom);
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

export default StyledBottomNavItem;
