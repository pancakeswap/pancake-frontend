import {
      createContext,
      ReactNode,
      useCallback,
      useContext,
      useEffect,
      useMemo,
      useState,
    } from "react";
    
    import { Web3Modal } from "@web3modal/standalone";
    
    import { DappClient } from "@walletconnect/push-client";
    import { Core } from "@walletconnect/core";
    import AuthClient, { generateNonce } from "@walletconnect/auth-client";
   
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
    const relayUrl = process.env.NEXT_PUBLIC_RELAY_URL || 'wss://relay.walletconnect.com'
    
    export const DEFAULT_APP_METADATA = {
      description: 'A simple gm notification dApp',
      icons: ['https://i.imgur.com/q9QDRXc.png'],
      name: 'gm-dApp',
      url: 'https://gm.walletconnect.com',
    }
    const core = new Core({
      projectId,
    });
    
    interface IContext {
      handleSubscribe: () => Promise<void>;
      handleUnSubscribe: () => Promise<void>;
      connectWithAuthClient: () => Promise<void>;
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
    /**
     * Provider
     */
    export function ClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
      const [pushClient, setPushClient] = useState<DappClient>();
      const [authClient, setAuthClient] = useState<AuthClient>();
    
      const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
      const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
      const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false);
    
      const [web3Modal, setWeb3Modal] = useState<Web3Modal>();

    
      // const _subscribeToProviderEvents = useCallback(
      //   async (_client: UniversalProvider) => {
      //     if (typeof _client === "undefined") {
      //       throw new Error("WalletConnect is not initialized");
      //     }
    
      //     _client.on("display_uri", async (uri: string) => {
      //       console.log("EVENT", "QR Code Modal open");
      //       web3Modal?.openModal({ uri });
      //     });
    
      //     // Subscribe to session ping
      //     _client.on("session_ping", ({ id, topic }: { id: number; topic: string }) => {
      //       console.log("EVENT", "session_ping");
      //       console.log(id, topic);
      //     });
    
      //     // Subscribe to session event
      //     _client.on("session_event", ({ event, chainId }: { event: any; chainId: string }) => {
      //       console.log("EVENT", "session_event");
      //       console.log(event, chainId);
      //     });
    
      //     // Subscribe to session update
      //     _client.on(
      //       "session_update",
      //       ({ topic, session }: { topic: string; session: SessionTypes.Struct }) => {
      //         console.log("EVENT", "session_updated");
      //         setSession(session);
      //       },
      //     );
    
      //     // Subscribe to session delete
      //     _client.on("session_delete", ({ id, topic }: { id: number; topic: string }) => {
      //       console.log("EVENT", "session_deleted");
      //       console.log(id, topic);
      //       resetApp();
      //     });
      //   },
      //   [web3Modal],
      // );
    
      const _subscribeToAuthClientEvents = useCallback(async (_authClient: AuthClient) => {
        if (typeof _authClient === "undefined") {
          throw new Error("WalletConnect is not initialized");
        }
        _authClient.on("auth_response", ({ params, topic }: any) => {
          if ("code" in params) {
            console.error(params);
            return;
          }
          if ("error" in params) {
            console.error(params.error);
            return;
          }
        console.log(`successfully verified connection`);
    
        });
        console.log(`successfully verified connection`);
      }, []);
    
      const _subscribeToPushClientEvents = useCallback(async (_pushClient: DappClient) => {
        if (typeof _pushClient === "undefined") {
          throw new Error("PushClient is not initialized");
        }
    
        _pushClient.on("push_response", (event) => {
          if (event.params.error) {
            setIsSubscribed(false);
            setIsSubscribing(false);
            console.error("Error on `push_response`:", event.params.error);
            console.log(`error on push response ${event.params.error.message}`);
          } else {
            // fetch("/api/subscribe", {
            //       method: "POST",
            //       headers: {
            //             "content-type": "application/json",
            //       },
            //       body: JSON.stringify({
            //             account: accounts[0],
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
            console.log("Established PushSubscription:", event.params.subscription);
          }
        });
    
        _pushClient.on("push_delete", event => {
          setIsSubscribed(false);
          setIsSubscribing(false);
          console.log(`Deleted PushSubscription on topic ${event.topic}`);
        });
      }, []);
    
      const connectWithAuthClient = useCallback(async () => {
        if (typeof authClient === "undefined") {
          throw new Error("WalletConnect is not initialized");
        }
        authClient
          .request({
            aud: window.location.href,
            domain: window.location.hostname.split(".").slice(-2).join("."),
            chainId: "eip155:1",
            type: "eip4361",
            nonce: generateNonce(),
            statement: "Sign in with wallet.",
          })
          .then(async ({ uri }) => {
            if (uri) {
              await web3Modal.openModal({
                uri,
                standaloneChains: ["eip155:1"],
              });
            }
          });
      }, [authClient, web3Modal]);
    
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
            account: `eip155:1:0xE05b3E63c1A10fe0B707741aE96e368Dd6EA872d`,
            pairingTopic: latestPairing.topic,
          });
    
          if (!id) {
            throw new Error("Subscription request failed", {
              cause: "Push propose failed",
            });
          }
          console.log(`The subscription request has been sent to your wallet`);
          setIsSubscribed(true)
        } catch (error) {
          setIsSubscribing(false);
          console.error({ subscribeError: error });
          if (error instanceof Error) {
            console.log(`error, ${error.message}`);
          }
        }
      }, [pushClient]);
    
      const handleUnSubscribe = useCallback(async () => {
        setIsUnsubscribing(true);
        try {
          if (!pushClient) {
            throw new Error("Push Client not initialized");
          }
          const pushSubscriptions = pushClient.getActiveSubscriptions();
          const currentSubscription = Object.values(pushSubscriptions).find(
            sub => sub.account === `eip155:1:0xE05b3E63c1A10fe0B707741aE96e368Dd6EA872d`,
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
      }, [setIsSubscribed, pushClient]);
    
      const createClient = useCallback(async () => {
    
          if (!projectId) return;
    
          const _pushClient = await DappClient.init({
            core,
            projectId,
            metadata: DEFAULT_APP_METADATA,
            relayUrl,
            logger: "debug",
          });
    
          const _authClient = await AuthClient.init({
            core,
            projectId,
            relayUrl,
            metadata: DEFAULT_APP_METADATA,
          });
    
          const web3Modal = new Web3Modal({
            projectId: projectId,
      standaloneChains: ["eip155:1"],
            
            walletConnectVersion: 2,
          });

          setPushClient(_pushClient);
          setAuthClient(_authClient);
          setWeb3Modal(web3Modal);
    
      }, []);
    
      useEffect(() => {
        if (!pushClient || !authClient) {
          createClient();
        }
      }, [pushClient, createClient, authClient]);
    
      useEffect(() => {
        if (pushClient && authClient && web3Modal) {
          _subscribeToPushClientEvents(pushClient);
          _subscribeToAuthClientEvents(authClient);
        }
      }, [
        _subscribeToPushClientEvents,
        _subscribeToAuthClientEvents,
        authClient,
        pushClient,
        web3Modal,
      ]);
    
      useEffect(() => {
        if (!pushClient) {
          return;
        }
        const activeSubscriptions = pushClient?.getActiveSubscriptions();
        console.log('activeS', activeSubscriptions)
        if (
          Object.values(activeSubscriptions).some((sub) => sub.account === `eip155:1:0xE05b3E63c1A10fe0B707741aE96e368Dd6EA872d`)
        ) {
          setIsSubscribed(true);
        }
      }, [pushClient]);
    
    
      const value = useMemo(
        () => ({
          handleSubscribe,
          handleUnSubscribe,
          connectWithAuthClient,
          isSubscribed,
          isSubscribing,
          isUnsubscribing
        }),
        [
          handleSubscribe,
          handleUnSubscribe,
          connectWithAuthClient,
          isSubscribed,
          isSubscribing,
          isUnsubscribing
        ],
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
    
    export function useWalletConnectClient() {
      const context = useContext(ClientContext);
      if (context === undefined) {
        throw new Error("useWalletConnectClient must be used within a ClientContextProvider");
      }
      return context;
    }
    