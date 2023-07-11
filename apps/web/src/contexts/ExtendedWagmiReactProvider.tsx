import Client from "@walletconnect/sign-client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import { Web3Modal } from "@web3modal/standalone";
import {
      createContext,
      ReactNode,
      useCallback,
      useContext,
      useEffect,
      useMemo,
      useRef,
      useState,
} from "react";

import { getAppMetadata, getSdkError } from "@walletconnect/utils";
import {
      DEFAULT_APP_METADATA,
      DEFAULT_LOGGER,
      DEFAULT_PROJECT_ID,
      DEFAULT_RELAY_URL,
} from "views/Notifications/utils/constants";
import { AccountBalances, apiGetAccountBalance } from "views/Notifications/helpers";
import { getOptionalNamespaces, getRequiredNamespaces } from "views/Notifications/helpers/namespaces";
import { DappClient } from "@walletconnect/push-client";
import { Core } from "@walletconnect/core";
import AuthClient, { generateNonce } from "@walletconnect/auth-client";
import { useAccount } from "wagmi";

/**
 * Types
 */
interface IContext {
      handleSubscribe: () => Promise<void>;
      handleUnSubscribe: () => Promise<void>;
      isSubscribed: boolean;
      isSubscribing: boolean;
      isUnsubscribing: boolean
}

/**
 * Context
 */
export const ClientContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function ExtendedWagmiProvider({
      children,
}: {
      children: ReactNode | ReactNode[];
}) {

      const { connector, address: account } = useAccount()
      const [pushClient, setPushClient] = useState<DappClient>();
      const [authClient, setAuthClient] = useState<AuthClient>();

      const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
      const [isSendingGm, setIsSendingGm] = useState<boolean>(false);
      const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
      const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false);

      
      const handleSubscribe = useCallback(async () => {
            setIsSubscribing(true);
            try {
                  if (!pushClient) {
                        throw new Error("Push Client not initialized");
                  }
                  // Resolve known pairings from the Core's Pairing API.
                  const pairings = pushClient.core.pairing.getPairings();
                  if (!pairings?.length) {
                        throw new Error("No pairings found");
                  }
                  // Use the latest pairing.
                  const latestPairing = pairings[pairings.length - 1];
                  if (!latestPairing?.topic) {
                        throw new Error("Subscription failed", {
                              cause: "pairingTopic is missing",
                        });
                  }
                  const { id } = await pushClient.propose({
                        account: `eip155:1:${account}`,
                        pairingTopic: latestPairing.topic,
                  });

                  if (!id) {
                        throw new Error("Subscription request failed", {
                              cause: "Push propose failed",
                        });
                  }
                  console.log(
                        `The subscription request has been sent to your wallet`
                  );
            } catch (error) {
                  setIsSubscribing(false);
                  console.error({ subscribeError: error });
                  if (error instanceof Error) {
                        console.log(`error, ${error.message}`);
                  }
            }
      }, [account, pushClient]);

      const handleUnSubscribe = useCallback(async () => {
            setIsUnsubscribing(true);
            try {
                  if (!pushClient) {
                        throw new Error("Push Client not initialized");
                  }
                  const pushSubscriptions = pushClient.getActiveSubscriptions();
                  const currentSubscription = Object.values(pushSubscriptions).find(
                        (sub) => sub.account === `eip155:1:${account}`
                  );

                  if (currentSubscription) {
                       
                        await pushClient.deleteSubscription({
                              topic: currentSubscription.topic,
                        });

                        setIsUnsubscribing(false);
                        setIsSubscribed(false);
                        console.log(`You unsubscribed from gm notification`);
                  }
            } catch (error) {
                  setIsUnsubscribing(false);
                  console.error({ unsubscribeError: error });
                  if (error instanceof Error) {
                        console.log(`error, ${error.message}`);
                  }
            }
      }, [setIsSubscribed, account, pushClient]);

     
      const _subscribeToPushClientEvents = useCallback(
            async (_pushClient: DappClient) => {
                  if (typeof _pushClient === "undefined") {
                        throw new Error("PushClient is not initialized");
                  }

                  _pushClient.on("push_response", (event) => {
                        if (event.params.error) {
                              setIsSubscribed(false);
                              setIsSubscribing(false);
                              console.error(
                                    "Error on `push_response`:",
                                    event.params.error
                              );
                              console.log(
                                    `error on push response ${event.params.error.message}`
                              );
                        } else {
                              // fetch("/api/subscribe", {
                              //       method: "POST",
                              //       headers: {
                              //             "content-type": "application/json",
                              //       },
                              //       body: JSON.stringify({
                              //             account: accounts[1],
                              //       }),
                              // })
                              //       .then(async (data) => data.json())
                              //       .then((data) => {
                              //             if (data.success) {
                              //                   setIsSubscribed(true);
                              //                   setIsSubscribing(false);
                              //                   console.log(
                              //                         "Established PushSubscription:",
                              //                         event.params.subscription
                              //                   );
                              //             } else {
                              //                   throw new Error(data.message);
                              //             }
                              //       })
                              //       .catch((e) => {
                              //             console.log(e);
                              //             setIsSubscribed(false);
                              //             setIsSubscribing(false);
                              //             console.log(`errorr`, e.message);
                              //       });
                              console.log(
                                "Established PushSubscription:",
                                event.params.subscription
                          );
                        }
                  });

                  _pushClient.on("push_delete", (event) => {
                        setIsSubscribed(false);
                        setIsSubscribing(false);
                        console.log(
                              `Deleted PushSubscription on topic ${event.topic}`
                        );
                  });
            },
            []
      );

      useEffect(() => {
            const init = async () => {
            if (connector) {
                 const _pushClient = await connector.getPushClient()
                 const _authClient = await connector.getAuthClient()
                 setPushClient(_pushClient)
                 setAuthClient(_authClient)

            } 
      }
      init()
      }, [connector]);

      useEffect(() => {
        if (!pushClient || !account) {
          return;
        }
        const activeSubscriptions = pushClient.getActiveSubscriptions();

        if (
          Object.values(activeSubscriptions).some((sub) => sub.account === `eip155:1:${account}`)
        ) {
          setIsSubscribed(true);
        }
      }, [pushClient, account]);

      const value = useMemo(
            () => ({
                  handleSubscribe,
                  handleUnSubscribe,
                  isSubscribed,
                  isSubscribing,
                  isUnsubscribing
            }),
            [
                  handleSubscribe,
                  handleUnSubscribe,
                  isSubscribed,
                  isSubscribing,
                  isUnsubscribing
                  
            ]
      );

      return (
            <ClientContext.Provider
                  value={{
                        ...value,
                  }}
            >
                  {children}
            </ClientContext.Provider>
      );
}

export function useExtendedProvider() {
      const context = useContext(ClientContext);
      if (context === undefined) {
            throw new Error(
                  "ExtendedWagmiProvider must be used within a ClientContextProvider"
            );
      }
      return context;
}
