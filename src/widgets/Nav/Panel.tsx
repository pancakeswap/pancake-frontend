import React from "react";
import styled from "styled-components";
import Link from "../../components/Link";
import UserBlock from "./UserBlock";
import config from "./config";
import { ConnectCallbackType } from "./types";

interface Props {
  show: boolean;
  account?: string;
  closeNav: () => void;
  connectCallbacks: ConnectCallbackType[];
  logout: () => void;
}

const PanelContainer = styled.div<{ show: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.nav.background};
  top: 0;
  right: ${({ show }) => (show ? 0 : "-100%")};
  width: 100%;
  max-width: 320px;
  height: 100vh;
  padding: 32px 0;
  overflow-y: auto;
  transition: right 0.4s;
  z-index: 11;
  ${({ theme }) => theme.mediaQueries.md} {
    position: unset;
    max-width: unset;
    overflow-y: unset;
    z-index: unset;
    padding: 0;
    justify-content: space-between;
    flex-direction: row;
    height: 100%;
  }
`;

const StyledLink = styled(Link)`
  width: 100%;
  height: 100%;
  padding: 8px 40px;
  transition: background-color 0.2s;
  :hover {
    background-color: ${({ theme }) => theme.nav.hover};
    text-decoration: none;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    align-items: center;
    padding: 0 16px;
  }
`;

const LinkBlock = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  order: 2;
  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
    flex-direction: row;
  }
`;

const Panel: React.FC<Props> = ({ show, account, closeNav, connectCallbacks, logout }) => {
  return (
    <PanelContainer show={show}>
      <LinkBlock>
        {config.nav.map((entry) => (
          <StyledLink key={entry.href} href={entry.href}>
            {entry.label}
          </StyledLink>
        ))}
      </LinkBlock>
      <UserBlock account={account} closeNav={closeNav} connectCallbacks={connectCallbacks} logout={logout} />
    </PanelContainer>
  );
};

export default Panel;
