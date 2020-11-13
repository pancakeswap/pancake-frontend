import React from "react";
import noop from "lodash/noop";
import Button from "../../components/Button";
import Flex from "../../components/Flex";
import useWalletModal from "./index";
import { ConnectCallbackType } from "./types";

export default {
  title: "WalletModal",
  argTypes: {},
};

const connectCallbacks: ConnectCallbackType[] = [
  { key: "metamask", callback: noop },
  { key: "trustwallet", callback: noop },
  { key: "mathwallet", callback: noop },
  { key: "tokenpocket", callback: noop },
  { key: "walletconnect", callback: noop },
];

export const Connected: React.FC = () => {
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(
    connectCallbacks,
    () => null,
    "0xbdda50183d817c3289f895a4472eb475967dc980"
  );
  return (
    <Flex>
      <Button onClick={onPresentConnectModal}>Open connect modal</Button>
      <Button onClick={onPresentAccountModal}>Open account modal</Button>
    </Flex>
  );
};
