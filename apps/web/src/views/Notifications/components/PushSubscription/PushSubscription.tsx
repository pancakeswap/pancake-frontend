
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { PushContext } from "contexts/PushContext";
import { PROJECT_METADATA } from "views/Notifications/utils/constants";
import { Button, Flex, useToast } from "@pancakeswap/uikit";
import { ToastDescriptionWithTx } from "components/Toast";
import { useTranslation } from "@pancakeswap/localization";
import {DappClient} from "@walletconnect/push-client"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

interface IPushSubscriptionProps {
  account: string;
  pushClient: DappClient
}

const PushSubscription: FC<IPushSubscriptionProps> = ({ account, pushClient }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isSendingGm, setIsSendingGm] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false);
  const { toastSuccess: toast } = useToast()
  const { t } = useTranslation()


  useEffect(() => {
    if (!pushClient || !account) {
      return;
    }
    const activeSubscriptions = pushClient?.getActiveSubscriptions();

    if (
      Object.values(activeSubscriptions).some((sub) => sub.account === account)
    ) {
      setIsSubscribed(true);
    }
  }, [pushClient, account]);

  const handleSubscribe = useCallback(async () => {
    setIsSubscribing(true);

    try {
      if (!pushClient) {
        throw new Error("Push Client not initialized");
      }

      // Resolve known pairings from the Core's Pairing API.
      // pushClient.
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

      console.log(latestPairing)
      const { id } = await pushClient.propose({
        account,
        pairingTopic: latestPairing.topic,
      });

      if (!id) {
        throw new Error("Subscription request failed", {
          cause: "Push propose failed",
        });
      }
      toast(t('Subscription request sent!'), <ToastDescriptionWithTx txHash='' />)
    } catch (error) {
      setIsSubscribing(false);
      console.error({ subscribeError: error });
      if (error instanceof Error) {
            toast(t('error!'), <ToastDescriptionWithTx txHash='' />)

      }
    }
  }, [toast, account, pushClient, t]);

  const handleUnsubscribe = useCallback(async () => {
    setIsUnsubscribing(true);
    try {
      if (!pushClient) {
        throw new Error("Push Client not initialized");
      }
      const pushSubscriptions = pushClient.getActiveSubscriptions();
      const currentSubscription = Object.values(pushSubscriptions).find(
        (sub) => sub.account === account
      );

      if (currentSubscription) {
        const unsubscribeRawRes = await fetch("/api/notifications/unsubscribe", {
          method: "DELETE",
          body: JSON.stringify({
            account,
          }),
          headers: {
            "content-type": "application/json",
          },
        });
        const unsubscribeRes = await unsubscribeRawRes.json();
        const isSuccess = unsubscribeRes.success;
        if (!isSuccess) {
          throw new Error("Failed to unsubscribe!");
        }
        await pushClient.deleteSubscription({
          topic: currentSubscription.topic,
        });

        setIsUnsubscribing(false);
        setIsSubscribed(false);
        toast(t('unSubscribed'), <ToastDescriptionWithTx txHash='' />)

      }
    } catch (error) {
      setIsUnsubscribing(false);
      console.error({ unsubscribeError: error });
      if (error instanceof Error) {
            toast(t('error'), <ToastDescriptionWithTx txHash='' />)

      }
    }
  }, [setIsSubscribed, toast, account, pushClient, t]);

  const handleSendGm = useCallback(async () => {
    setIsSendingGm(true);
    try {
      if (!pushClient) {
        throw new Error("Push Client not initialized");
      }
      // Construct the payload, including the target `accounts`
      // that should receive the push notification.
      const notificationPayload = {
        accounts: [account],
        notification: {
          title: "gm!",
          body: "This is a test gm notification",
          // href already contains the trailing slash
          icon: `${window.location.href}gmMemesArtwork.png`,
          url: window.location.href,
          type: "gm_hourly",
        },
      };

      // We can construct the URL to the Cast server using the `castUrl` property
      // of the `PushDappClient` (which will be `https://cast.walletconnect.com` by default),
      // together with our Project ID.
      const result = await fetch(`${pushClient.castUrl}/${projectId}/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationPayload),
      });

      const gmRes = await result.json(); // { "sent": ["eip155:1:0xafeb..."], "failed": [], "not_found": [] }
      const isSuccessfulGm = gmRes.sent.includes(account);
      setIsSendingGm(false);
      toast(isSuccessfulGm
            ? `gm notification sent to ${account}`
            : "gm notification failed", <ToastDescriptionWithTx txHash='' />)

    } catch (error) {
      setIsSendingGm(false);
      console.error({ sendGmError: error });
      if (error instanceof Error) {
            toast(t('error'), <ToastDescriptionWithTx txHash='' />)

      }
    }
  }, [toast, account, pushClient, t]);

  useEffect(() => {
    if (!pushClient) {
      return;
    }
    pushClient.on("push_response", (event) => {
      if (event.params.error) {
        setIsSubscribed(false);
        setIsSubscribing(false);
        console.error("Error on `push_response`:", event.params.error);
        toast(t('error on push respnse'), <ToastDescriptionWithTx txHash='' />)

      } else {
        fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            account,
          }),
        })
          .then(async (data) => data.json())
          .then((data) => {
            if (data.success) {
              setIsSubscribed(true);
              setIsSubscribing(false);
              console.log(
                "Established PushSubscription:",
                event.params.subscription
              );
              toast(t('established push sub'), <ToastDescriptionWithTx txHash='' />)

            } else {
            //   throw new Error(data.message);
            setIsSubscribed(true);
              setIsSubscribing(false);
              console.log(
                "Established PushSubscription:",
                event.params.subscription
              );
              toast(t('established push sub'), <ToastDescriptionWithTx txHash='' />)
            }
          })
          .catch((e) => {
            console.log(e);
            setIsSubscribed(false);
            setIsSubscribing(false);
            toast(t('error'), <ToastDescriptionWithTx txHash='' />)
            // setIsSubscribed(true);
            //   setIsSubscribing(false);
            //   console.log(
            //     "Established PushSubscription:",
            //     event.params.subscription
            //   );
            //   toast(t('established push sub'), <ToastDescriptionWithTx txHash='' />)

          });
      }
    });

    pushClient.on("push_delete", (event) => {
      setIsSubscribed(false);
      setIsSubscribing(false);
      toast(t('deleted push sub'), <ToastDescriptionWithTx txHash='' />)

    });
  }, [toast, account, pushClient, t]);

  return isSubscribed ? (
    <Flex flexDirection="column">
      <Button
      variant="primary"
        onClick={handleSendGm}
        disabled={isSendingGm}
      >
        Send me a gm
      </Button>
      <Button
      variant="primary"

        onClick={handleUnsubscribe}
        isLoading={isUnsubscribing}
        disabled={isUnsubscribing}
      >
       {isUnsubscribing ? 'Unsubscribing..' : "Unsubscribe from gm"} 
      </Button>
    </Flex>
  ) : (
    <Button
    variant="primary"

      onClick={handleSubscribe}
      isLoading={isSubscribing}
      disabled={isSubscribing}
    >
      {isUnsubscribing ? 'Subscribing.....' : "Subscribe from gm"} 
    </Button>
  );
};

export default PushSubscription;
