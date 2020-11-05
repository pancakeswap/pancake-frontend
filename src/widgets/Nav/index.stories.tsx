import React from "react";
import Nav from "./index";
import { ConnectCallbackType } from "./types";

export default {
  title: "Nav",
  component: Nav,
  argTypes: {},
};

const connectCallbacks: ConnectCallbackType[] = [
  { key: "metamask", callback: () => null },
  { key: "trustwallet", callback: () => null },
  { key: "mathwallet", callback: () => null },
  { key: "tokenpocket", callback: () => null },
  { key: "walletconnect", callback: () => null },
];

export const Connected: React.FC = () => {
  return (
    <Nav account="0xbdda50183d817c3289f895a4472eb475967dc980" connectCallbacks={connectCallbacks} logout={() => null} />
  );
};

export const NotConnected: React.FC = () => {
  return <Nav account={null} connectCallbacks={connectCallbacks} logout={() => null} />;
};
