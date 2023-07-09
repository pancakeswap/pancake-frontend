import AuthClient from "@walletconnect/auth-client";
import { Core } from "@walletconnect/core";
import { DappClient } from "@walletconnect/push-client";
import SignClient from "@walletconnect/sign-client";
import { PROJECT_METADATA } from "./constants";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const relayUrl =
  process.env.NEXT_PUBLIC_RELAY_URL || "wss://relay.walletconnect.com";

const core = new Core({
  projectId,
});

// eslint-disable-next-line import/no-mutable-exports
export let authClient: AuthClient;
// eslint-disable-next-line import/no-mutable-exports
export let pushClient: DappClient;
// eslint-disable-next-line import/no-mutable-exports
export let signClient: SignClient;

export async function createSignClient() {
  if (!projectId) {
    throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
  }
  signClient = await SignClient.init({
    projectId,
    core,
    relayUrl,
    metadata: PROJECT_METADATA,
  });
}

export async function createAuthClient() {
  if (!projectId) {
    throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
  }
  authClient = await AuthClient.init({
    core,
    projectId,
    relayUrl,
    metadata: PROJECT_METADATA,
  });
}

export async function createPushClient() {
  if (!projectId) {
    throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
  }
  pushClient = await DappClient.init({
    core,
    projectId,
    metadata: PROJECT_METADATA,
    relayUrl,
    logger: "debug",
  });

  console.log("pushClient", pushClient);
}
