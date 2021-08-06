import React, { useEffect, useState } from "react";
import noop from "lodash/noop";
import { BrowserRouter, Link, MemoryRouter } from "react-router-dom";
import Flex from "../../components/Box/Flex";
import Box from "../../components/Box/Box";
import Heading from "../../components/Heading/Heading";
import Text from "../../components/Text/Text";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Language } from "./types";
import { links } from "./config";
import { MenuEntry } from "./components/MenuEntry";
import UserMenu from "./components/UserMenu";
import { UserMenuDivider, UserMenuItem } from "./components/UserMenu/styles";
import { variants, Variant } from "./components/UserMenu/types";
import Menu from "./Menu";
import { CogIcon, LanguageCurrencyIcon, LogoutIcon } from "../../components/Svg";
import IconButton from "../../components/Button/IconButton";
import { Modal, ModalProps, useModal } from "../Modal";

export default {
  title: "Widgets/Menu",
  component: Menu,
  argTypes: {},
};

const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));

const UserMenuComponent: React.FC<{ variant?: Variant; text?: string; account?: string }> = ({
  variant = variants.DEFAULT,
  text,
  account = "0x8b017905DC96B38f817473dc885F84D4C76bC113",
}) => (
  <UserMenu variant={variant} text={text} account={account}>
    <UserMenuItem type="button" onClick={noop}>
      Wallet
    </UserMenuItem>
    <UserMenuItem type="button">Transactions</UserMenuItem>
    <UserMenuDivider />
    <UserMenuItem type="button" disabled>
      Dashboard
    </UserMenuItem>
    <UserMenuItem type="button" disabled>
      Portfolio
    </UserMenuItem>
    <UserMenuItem as={Link} to="/profile">
      React Router Link
    </UserMenuItem>
    <UserMenuItem as="a" href="https://pancakeswap.finance" target="_blank">
      Link
    </UserMenuItem>
    <UserMenuDivider />
    <UserMenuItem as="button" onClick={noop}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        Disconnect
        <LogoutIcon />
      </Flex>
    </UserMenuItem>
  </UserMenu>
);

const GlobalMenuModal: React.FC<ModalProps> = ({ title, onDismiss, ...props }) => (
  <Modal title={title} onDismiss={onDismiss} {...props}>
    <Heading>{title}</Heading>
    <Button>This button Does nothing</Button>
  </Modal>
);

const GlobalMenuComponent: React.FC = () => {
  const [onPresent1] = useModal(<GlobalMenuModal title="Display Settings Modal" />);
  const [onPresent2] = useModal(<GlobalMenuModal title="Global Settings Modal" />);

  return (
    <Flex>
      <IconButton onClick={onPresent1} variant="text" scale="sm" mr="4px">
        <LanguageCurrencyIcon height={22} width={22} color="textSubtle" />
      </IconButton>
      <IconButton onClick={onPresent2} variant="text" scale="sm" mr="8px">
        <CogIcon height={22} width={22} color="textSubtle" />
      </IconButton>
    </Flex>
  );
};

// This hook is used to simulate a props change, and force a re rendering
const useProps = () => {
  const [props, setProps] = useState({
    account: "0xbdda50183d817c3289f895a4472eb475967dc980",
    login: noop,
    logout: noop,
    isDark: false,
    toggleTheme: noop,
    langs,
    setLang: noop,
    currentLang: "EN",
    cakePriceUsd: 0.023158668932877668,
    links,
    profile: null,
    userMenu: <UserMenuComponent account="0xbdda50183d817c3289f895a4472eb475967dc980" />,
    globalMenu: <GlobalMenuComponent />,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProps({
        account: "0xbdda50183d817c3289f895a4472eb475967dc980",
        login: noop,
        logout: noop,
        isDark: false,
        toggleTheme: noop,
        langs,
        setLang: noop,
        currentLang: "EN",
        cakePriceUsd: 0.023158668932877668,
        links,
        profile: null,
        userMenu: <UserMenuComponent account="0xbdda50183d817c3289f895a4472eb475967dc980" />,
        globalMenu: <GlobalMenuComponent />,
      });
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return props;
};

export const Connected: React.FC = () => {
  const props = useProps();
  return (
    <BrowserRouter>
      <Menu {...props}>
        <div>
          <Heading as="h1" mb="8px">
            Page body
          </Heading>
          <Text as="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
            qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut
          </Text>
        </div>
      </Menu>
    </BrowserRouter>
  );
};

export const NotConnected: React.FC = () => {
  return (
    <BrowserRouter>
      <Menu isDark={false} toggleTheme={noop} langs={langs} setLang={noop} currentLang="EN" links={links}>
        <div>
          <h1>Page body</h1>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </div>
      </Menu>
    </BrowserRouter>
  );
};

export const WithoutConnectButton: React.FC = () => {
  return (
    <BrowserRouter>
      <Menu isDark={false} toggleTheme={noop} langs={langs} setLang={noop} currentLang="EN" links={links}>
        <div>
          <h1>No connect button on top</h1>
          This variant is needed for info site
        </div>
      </Menu>
    </BrowserRouter>
  );
};

export const MenuEntryComponent: React.FC = () => {
  return (
    <Flex justifyContent="space-between" p="16px" style={{ backgroundColor: "wheat" }}>
      <MenuEntry>Default</MenuEntry>
      <MenuEntry secondary>Secondary</MenuEntry>
      <MenuEntry isActive>isActive</MenuEntry>
    </Flex>
  );
};

export const WithSubmenuSelected: React.FC = () => {
  return (
    <MemoryRouter initialEntries={["/teams"]}>
      <Menu
        isDark={false}
        toggleTheme={noop}
        langs={langs}
        setLang={noop}
        currentLang="EN"
        cakePriceUsd={0.23158668932877668}
        links={links}
      >
        <div>
          <Heading as="h1" mb="8px">
            Submenu leaderboard selected
          </Heading>
        </div>
      </Menu>
    </MemoryRouter>
  );
};

export const UserMenuWithVariants: React.FC = () => {
  const [variant, setVariant] = useState<Variant>(variants.DEFAULT);
  const [text, setText] = useState(undefined);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setText(value);
  };

  return (
    <BrowserRouter>
      <Box p="40px">
        <Flex justifyContent="space-between">
          <Box>
            <Heading size="sm" mb="16px">
              Variants
            </Heading>
            <Flex mb="16px">
              {Object.keys(variants).map((variantKey) => (
                <Button
                  scale="sm"
                  variant={variant === variants[variantKey] ? "primary" : "text"}
                  ml="8px"
                  onClick={() => setVariant(variants[variantKey])}
                >
                  {variants[variantKey].toUpperCase()}
                </Button>
              ))}
            </Flex>
            <Box py="8px">
              <Input value={text} onChange={handleChange} placeholder="Custom Text..." />
            </Box>
          </Box>
          <UserMenuComponent variant={variant} text={text} />
        </Flex>
      </Box>
    </BrowserRouter>
  );
};
