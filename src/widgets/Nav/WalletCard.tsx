import React from "react";
import config from "./config";
import Button from "../../components/Button";
import Text from "../../components/Text";
import { ConnectCallbackType } from "./types";

interface Props {
  connectCallback: ConnectCallbackType;
  onDismiss: () => void;
  mb: string;
}

const { wallets } = config;

const WalletCard: React.FC<Props> = ({ connectCallback, onDismiss, mb }) => {
  const walletConfig = wallets[connectCallback.key];
  if (!walletConfig) {
    return null;
  }
  const { title, icon: Icon } = walletConfig;
  return (
    <Button
      fullWidth
      variant="tertiary"
      onClick={() => {
        connectCallback.callback();
        onDismiss();
      }}
      style={{ justifyContent: "space-between" }}
      mb={mb}
    >
      <Text bold color="primary" mr="16px">
        {title}
      </Text>
      <Icon width="32px" />
    </Button>
  );
};

export default WalletCard;
