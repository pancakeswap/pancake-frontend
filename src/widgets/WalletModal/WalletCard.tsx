import React, { FC } from "react";
import Button from "../../components/Button";
import Text from "../../components/Text";
import SvgProps from "../../components/Svg/types";

interface Config {
  title: string;
  icon: FC<SvgProps>;
  connectorId: string;
}

interface Props {
  walletConfig: Config;
  login: (id: string) => void;
  onDismiss: () => void;
  mb: string;
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss, mb }) => {
  const { title, icon: Icon } = walletConfig;
  return (
    <Button
      fullWidth
      variant="tertiary"
      onClick={() => {
        login(walletConfig.connectorId);
        window.localStorage.setItem("accountStatus", "1");
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
