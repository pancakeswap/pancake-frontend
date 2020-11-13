import React from "react";
import styled from "styled-components";
import Link from "../../components/Link";
import { HelpIcon } from "../../components/Svg";
import { Modal } from "../Modal";
import WalletCard from "./WalletCard";
import { ConnectCallbackType } from "./types";

interface Props {
  connectCallbacks: ConnectCallbackType[];
  onDismiss?: () => void;
}

const HelpLink = styled(Link)`
  display: flex;
  align-self: center;
  align-items: center;
  margin-top: 24px;
`;

const ConnectModal: React.FC<Props> = ({ connectCallbacks, onDismiss = () => null }) => (
  <Modal title="Connect to a wallet" onDismiss={onDismiss}>
    {connectCallbacks.map((connectCallback, index) => (
      <WalletCard
        key={connectCallback.key}
        connectCallback={connectCallback}
        onDismiss={onDismiss}
        mb={index < connectCallbacks.length - 1 ? "8px" : "0"}
      />
    ))}
    <HelpLink
      href="https://docs.pancakeswap.finance/guides/faq#how-do-i-set-up-my-wallet-on-binance-smart-chain"
      target="_blank"
      rel="noopener noreferrer"
    >
      <HelpIcon color="primary" mr="6px" />
      Learn how to connect
    </HelpLink>
  </Modal>
);

export default ConnectModal;
