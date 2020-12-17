import React from "react";
import styled from "styled-components";
import { CloseIcon, ChevronDownIcon } from "../../components/Svg";
import Button from "../../components/Button/Button";
import Dropdown from "../../components/Dropdown/Dropdown";
import MenuDropdwn from "./MenuDropdwn";
import Language from "./icons/Language";
import UserBlock from "./UserBlock";
import PancakePrice from "./PancakePrice";
import { MobileOnlyButton, MenuButton, MenuLink } from "./Buttons";
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

  .link {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    padding: 8px 40px;
    font-weight: 600;
    transition: background-color 0.2s;
    color: ${({ theme }) => theme.colors.primary};
    :hover {
      background-color: ${({ theme }) => theme.nav.hover};
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      height: 100%;
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
  login,
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
        {config.map((entry) => {
          if (entry.items) {
            return (
              <MenuDropdwn
                key={entry.label}
                target={
                  <div className="link" role="button">
                    {entry.label}
                    <ChevronDownIcon color="primary" />
                  </div>
                }
              >
                {entry.items.map((item) => (
                  <MenuLink key={item.href} href={item.href} onClick={closeNav}>
                    {item.label}
                  </MenuLink>
                ))}
              </MenuDropdwn>
            );
          }

          return (
            <MenuLink key={entry.label} href={entry.href} onClick={closeNav}>
              {entry.label}
            </MenuLink>
          );
        })}
      </LinkBlock>
      <ControlBlock>
        <PancakePrice cakePriceUsd={cakePriceUsd} />
        <MenuButton onClick={() => toggleTheme(!isDark)}>
          {isDark ? <Light color="primary" /> : <Dark color="primary" />}
        </MenuButton>
        <Dropdown
          target={
            <MenuButton startIcon={<Language color="primary" />} mr="4px">
              {currentLang.toUpperCase()}
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
              style={{ minHeight: "32px", height: "auto" }}
            >
              {lang.language}
            </Button>
          ))}
        </Dropdown>
      </ControlBlock>
      <UserBlock account={account} closeNav={closeNav} login={login} logout={logout} />
    </StyledPanel>
  );
};

export default Panel;
