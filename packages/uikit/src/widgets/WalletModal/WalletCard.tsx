import React from "react";
import { isDesktop, isMobile } from "react-device-detect";
import styled from "styled-components";
import { ButtonProps } from "../../components/Button";
import Button from "../../components/Button/Button";
import { Link } from "../../components/Link";
import MoreHorizontal from "../../components/Svg/Icons/MoreHorizontal";
import Text from "../../components/Text/Text";
import { connectorLocalStorageKey, walletLocalStorageKey } from "./config";
import { Login, WalletConfig } from "./types";

interface Props<T> {
  walletConfig: WalletConfig<T>;
  login: Login<T>;
  onDismiss: () => void;
}

const WalletButton = styled(Button).attrs({ width: "100%", variant: "text", py: "16px" })`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
`;

interface MoreWalletCardProps extends ButtonProps {
  t: (key: string) => string;
}

export const MoreWalletCard: React.FC<React.PropsWithChildren<MoreWalletCardProps>> = ({ t, ...props }) => {
  return (
    <WalletButton variant="tertiary" {...props}>
      <MoreHorizontal width="40px" mb="8px" color="textSubtle" />
      <Text fontSize="14px">{t("More")}</Text>
    </WalletButton>
  );
};

const WalletCard: React.FC<React.PropsWithChildren<Props<any>>> = ({ login, walletConfig, onDismiss }) => {
  const { title, icon: Icon, installed, downloadLink } = walletConfig;

  let linkAction: any = {
    onClick: () => {
      login(walletConfig.connectorId);
      localStorage?.setItem(walletLocalStorageKey, walletConfig.title);
      localStorage?.setItem(connectorLocalStorageKey, walletConfig.connectorId);
      onDismiss();
    },
  };

  if (installed === false && isDesktop && downloadLink?.desktop) {
    linkAction = {
      as: Link,
      href: downloadLink.desktop,
      style: {
        textDecoration: "none",
      },
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }
  if (typeof window !== "undefined" && !window.ethereum && walletConfig.href && isMobile) {
    linkAction = {
      style: {
        textDecoration: "none",
      },
      as: Link,
      href: walletConfig.href,
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return (
    <WalletButton variant="tertiary" {...linkAction} id={`wallet-connect-${title.toLowerCase()}`}>
      <Icon width="40px" mb="8px" />
      <Text fontSize="14px">{title}</Text>
    </WalletButton>
  );
};

export default WalletCard;
