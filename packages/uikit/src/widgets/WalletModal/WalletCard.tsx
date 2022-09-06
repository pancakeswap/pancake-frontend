import React from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import { Button } from "../../components/Button/Button";
import Text from "../../components/Text/Text";
import MoreHorizontal from "../../components/Svg/Icons/MoreHorizontal";
import { ButtonProps } from "../../components/Button";
import { connectorLocalStorageKey, walletConnectConfig, walletLocalStorageKey } from "./config";
import { Login, Config } from "./types";

interface Props {
  walletConfig: Config;
  login: Login;
  onDismiss: () => void;
}

const WalletButton = styled(Button)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
`;

WalletButton.defaultProps = { width: "100%", variant: "text", py: "16px" };

type MoreWalletCardProps = ButtonProps & {
  t: (key: string) => string;
};

export const MoreWalletCard: React.FC<React.PropsWithChildren<MoreWalletCardProps>> = ({ t, as, ...props }) => {
  return (
    <WalletButton variant="text" as={as as any} {...props}>
      <MoreHorizontal width="40px" mb="8px" color="textSubtle" />
      <Text fontSize="14px">{t("More")}</Text>
    </WalletButton>
  );
};

const WalletCard: React.FC<React.PropsWithChildren<Props>> = ({ login, walletConfig, onDismiss }) => {
  const { title, icon: Icon } = walletConfig;
  return (
    <WalletButton
      variant="text"
      onClick={() => {
        // TW point to WC on desktop
        if (title === "Trust Wallet" && walletConnectConfig && isDesktop) {
          login(walletConnectConfig.connectorId);
          localStorage?.setItem(walletLocalStorageKey, walletConnectConfig.title);
          localStorage?.setItem(connectorLocalStorageKey, walletConnectConfig.connectorId);
          onDismiss();
          return;
        }
        if (!window.ethereum && walletConfig.href) {
          window.open(walletConfig.href, "_blank", "noopener noreferrer");
        } else {
          login(walletConfig.connectorId);
          localStorage?.setItem(walletLocalStorageKey, walletConfig.title);
          localStorage?.setItem(connectorLocalStorageKey, walletConfig.connectorId);
          onDismiss();
        }
      }}
      id={`wallet-connect-${title.toLowerCase()}`}
    >
      <Icon width="40px" mb="8px" />
      <Text fontSize="14px">{title}</Text>
    </WalletButton>
  );
};

export default WalletCard;
