import styled from "styled-components";
import { Flex } from "../Box";

const StyledBottomNav = styled(Flex)`
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 5px 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding-bottom: env(safe-area-inset-bottom);
  html[data-useragent*="TokenPocket_iOS"] & {
    padding-bottom: 45px;
  }
`;

export const StyledOverlay = styled.div`
  content: "";
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => `${theme.colors.text}99`};
  backdrop-filter: blur(2px);
`;

export default StyledBottomNav;
