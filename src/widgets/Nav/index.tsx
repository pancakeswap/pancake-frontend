import React, { useState } from "react";
import styled from "styled-components";
import { HamburgerIcon } from "../../components/Svg";
import Button from "../../components/Button";
import Overlay from "../../components/Overlay";
import Logo from "./icons/Logo";
import Panel from "./Panel";
import { NavProps } from "./types";

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  height: 64px;
  background-color: ${({ theme }) => theme.nav.background};
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: normal;
  }
`;

const MobileButton = styled(Button)`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;
const StyledLink = styled.a`
  margin-right: 16px;
`;

const Nav: React.FC<NavProps> = ({ account, connectCallbacks, logout }) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <StyledNav>
      <StyledLink href="/" aria-label="Pancake home page">
        <Logo width="160px" height="100%" />
      </StyledLink>
      <MobileButton
        variant="text"
        size="sm"
        aria-label="Open mobile menu"
        onClick={() => setIsOpened((prevState) => !prevState)}
      >
        <HamburgerIcon />
      </MobileButton>
      <Panel
        show={isOpened}
        account={account}
        closeNav={() => setIsOpened(false)}
        connectCallbacks={connectCallbacks}
        logout={logout}
      />
      <Overlay show={isOpened} onClick={() => setIsOpened(false)} role="presentation" />
    </StyledNav>
  );
};

export default Nav;
