import { AuthClient } from "@walletconnect/auth-client/dist/types/client";
import { DappClient } from "@walletconnect/push-client";
import { SignClient } from "@walletconnect/sign-client/dist/types/client";
import { createContext } from "react";

export type PushState = {
  initialized: boolean;
  authClient?: AuthClient;
  pushClient?: DappClient;
  signClient?: SignClient;
};

export const initialPushState = {
  initialized: false,
} as PushState;

export const PushContext = createContext(initialPushState);
