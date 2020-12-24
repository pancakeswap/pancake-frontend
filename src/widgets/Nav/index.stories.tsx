import React from "react";
import noop from "lodash/noop";
import { BrowserRouter } from "react-router-dom";
import Nav from "./index";
import { LangType } from "./types";

export default {
  title: "Widgets/Nav",
  component: Nav,
  argTypes: {},
};

const langs: LangType[] = [
  { code: "en", language: "English" },
  { code: "ar", language: "العربية" },
  { code: "ca", language: "Català" },
  { code: "zh-CN", language: "简体中文" },
  { code: "zh-TW", language: "繁體中文" },
  { code: "cs", language: "Čeština" },
];

export const Connected: React.FC = () => {
  return (
    <BrowserRouter>
      <Nav
        account="0xbdda50183d817c3289f895a4472eb475967dc980"
        login={noop}
        logout={noop}
        isDark={false}
        toggleTheme={noop}
        langs={langs}
        setLang={noop}
        currentLang="EN"
        cakePriceUsd={0.23158668932877668}
      />
    </BrowserRouter>
  );
};

export const NotConnected: React.FC = () => {
  return (
    <BrowserRouter>
      <Nav
        account={null}
        login={noop}
        logout={() => null}
        isDark={false}
        toggleTheme={() => null}
        langs={langs}
        setLang={() => null}
        currentLang="EN"
        cakePriceUsd={0.23158668932877668}
      />
    </BrowserRouter>
  );
};
