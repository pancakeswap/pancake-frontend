import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { CloseIcon, LogoRoundIcon } from "../../components/Svg";
import Button from "../../components/Button";
import Flex from "../../components/Flex";
import Text from "../../components/Text";
import Dropdown from "../../components/Dropdown";
import Language from "./icons/Language";
import UserBlock from "./UserBlock";
import { MobileOnlyButton, MenuButton } from "./Buttons";
import config from "./config";
import Dark from "./icons/Dark";
import Light from "./icons/Light";
import { NavProps } from "./types";

interface Props extends NavProps {
  show: boolean;
  closeNav: () => void;
}

const StyledPanel = styled.div<{ show: boolean }>`
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
  ${({ theme }) => theme.mediaQueries.nav} {
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

const LinkBlock = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  order: 2;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.nav} {
    order: 1;
    margin-bottom: 0;
    flex-direction: row;
  }

  a {
    width: 100%;
    height: 100%;
    padding: 8px 40px;
    font-weight: bold;
    transition: background-color 0.2s;
    color: ${({ theme }) => theme.colors.primary};
    :hover {
      background-color: ${({ theme }) => theme.nav.hover};
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      display: flex;
      align-items: center;
      padding: 0 12px;
    }
  }
`;

const ControlBlock = styled.div`
  display: flex;
  align-items: center;
  order: 3;
  margin-left: 40px;
  ${({ theme }) => theme.mediaQueries.nav} {
    order: 2;
    margin-left: 0;
    flex-grow: 1;
    justify-content: flex-end;
  }
`;

const Panel: React.FC<Props> = ({
  show,
  account,
  closeNav,
  connectCallbacks,
  logout,
  isDark,
  toggleTheme,
  langs,
  setLang,
  currentLang,
  cakePriceUsd,
}) => {
  return (
    <StyledPanel show={show}>
      <MobileOnlyButton
        onClick={closeNav}
        aria-label="Close the menu"
        style={{ position: "absolute", top: "5px", right: "5px" }}
      >
        <CloseIcon />
      </MobileOnlyButton>
      <LinkBlock>
        {config.nav.map((entry) =>
          entry.href.startsWith("http") ? (
            <a key={entry.href} href={entry.href}>
              {entry.label}
            </a>
          ) : (
            <NavLink key={entry.href} to={entry.href} onClick={closeNav}>
              {entry.label}
            </NavLink>
          )
        )}
      </LinkBlock>
      <ControlBlock>
        {cakePriceUsd && (
          <Flex mr="4px">
            <LogoRoundIcon mr="4px" />
            <Text bold>{`$${cakePriceUsd.toFixed(3)}`}</Text>
          </Flex>
        )}
        <MenuButton onClick={() => toggleTheme(!isDark)}>
          {isDark ? <Light color="primary" /> : <Dark color="primary" />}
        </MenuButton>
        <Dropdown
          target={
            <MenuButton startIcon={<Language color="primary" />} mr="4px">
              {currentLang}
            </MenuButton>
          }
        >
          {langs.map((lang) => (
            <Button
              fullWidth
              key={lang.code}
              variant="text"
              size="sm"
              onClick={() => setLang(lang)}
              // Safari specific fix
              style={{ minHeight: "32px" }}
            >
              {lang.language}
            </Button>
          ))}
        </Dropdown>
      </ControlBlock>
      <UserBlock account={account} closeNav={closeNav} connectCallbacks={connectCallbacks} logout={logout} />
    </StyledPanel>
  );
};

export default Panel;
