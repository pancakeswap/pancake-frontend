import { Login } from "../WalletModal/types";

export type NavTheme = {
  background: string;
  hover: string;
};

export interface LangType {
  code: string;
  language: string;
}

export interface MenuLink {
  label: string;
  href: string;
}

export interface MenuDropdown {
  label: string;
  items: MenuLink[];
}

export interface NavProps {
  links: Array<MenuLink | MenuDropdown>;
  account?: string;
  login: Login;
  logout: () => void;
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  currentLang: string;
  langs: LangType[];
  setLang: (lang: LangType) => void;
  cakePriceUsd?: number;
}
