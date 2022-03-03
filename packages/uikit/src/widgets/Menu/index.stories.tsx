import noop from "lodash/noop";
import React, { useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter, Link, MemoryRouter } from "react-router-dom";
import Box from "../../components/Box/Box";
import Flex from "../../components/Box/Flex";
import Button from "../../components/Button/Button";
import IconButton from "../../components/Button/IconButton";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import { footerLinks } from "../../components/Footer/config";
import Heading from "../../components/Heading/Heading";
import Input from "../../components/Input/Input";
import { CogIcon, LanguageCurrencyIcon } from "../../components/Svg";
import Text from "../../components/Text/Text";
import { Modal, ModalProps, useModal } from "../Modal";
import UserMenu from "./components/UserMenu";
import { Variant, variants } from "./components/UserMenu/types";
import { links, userMenulinks } from "./config";
import Menu from "./Menu";
import { Language, NavProps } from "./types";
import BottomDrawer from "../../components/BottomDrawer/BottomDrawer";

export default {
  title: "Widgets/Menu",
  component: Menu,
  argTypes: {
    activeItem: {
      options: ["Trade", "Earn", "Win"],
      control: { type: "select" },
    },
  },
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
}) => {
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;
  return (
    <DropdownMenu items={userMenulinks} py="12px">
      <UserMenu account={text || accountEllipsis} avatarSrc="" variant={variant} />
    </DropdownMenu>
  );
};

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

const defaultProps = {
  linkComponent: ({ href, ...props }) => {
    return <Link to={href} {...props} />;
  },
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
  subLinks: links[0].items,
  footerLinks,
  profile: null,
  userMenu: <UserMenuComponent account="0xbdda50183d817c3289f895a4472eb475967dc980" />,
  globalMenu: <GlobalMenuComponent />,
  activeItem: "/swap",
  activeSubItem: "https://exchange.pancakeswap.finance",
  buyCakeLabel: "Buy CAKE",
};

const ConnectedTemplate: React.FC<NavProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BrowserRouter>
      <Menu {...args}>
        <div>
          <Heading as="h1" mb="8px">
            Page body
          </Heading>
          <Button scale="sm" onClick={() => setIsOpen(true)}>
            Show mobile drawer
          </Button>
          <BottomDrawer content={<Box p="16px">Example</Box>} isOpen={isOpen} setIsOpen={setIsOpen} />
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
export const Connected = ConnectedTemplate.bind({});
Connected.args = defaultProps;

export const ConnectedWithBanner = ConnectedTemplate.bind({});
ConnectedWithBanner.args = {
  ...defaultProps,
  banner: (
    <Flex height="100%" p="16px" alignItems="center" justifyContent="center" background="#7645D9">
      <Text color="invertedContrast" mr="8px">
        Banner example
      </Text>
      <Button scale="sm">I am button</Button>
    </Flex>
  ),
};

export const NotConnected: React.FC = () => {
  return (
    <BrowserRouter>
      <Menu
        isDark={false}
        toggleTheme={noop}
        langs={langs}
        setLang={noop}
        currentLang="EN"
        links={links}
        subLinks={links[0].items}
        footerLinks={footerLinks}
      >
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
      <Menu
        isDark={false}
        toggleTheme={noop}
        langs={langs}
        setLang={noop}
        currentLang="EN"
        links={links}
        footerLinks={footerLinks}
        subLinks={links[0].items}
      >
        <div>
          <h1>No connect button on top</h1>
          This variant is needed for info site
        </div>
      </Menu>
    </BrowserRouter>
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
        subLinks={subLinks}
        footerLinks={footerLinks}
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
