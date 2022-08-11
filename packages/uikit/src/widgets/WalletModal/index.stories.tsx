import React from "react";
import Button from "../../components/Button/Button";
import Flex from "../../components/Box/Flex";
import useWalletModal from "./useWalletModal";

export default {
  title: "Widgets/WalletModal",
  argTypes: {},
};

export const Wallet: React.FC<React.PropsWithChildren> = () => {
  const { onPresentConnectModal } = useWalletModal(
    () => null,
    (s) => s
  );
  return (
    <Flex>
      <Button onClick={onPresentConnectModal}>Open connect modal</Button>
    </Flex>
  );
};
