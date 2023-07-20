
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { PROJECT_METADATA } from "views/Notifications/utils/constants";
import { Button, Flex, useToast } from "@pancakeswap/uikit";
import { ToastDescriptionWithTx } from "components/Toast";
import { useTranslation } from "@pancakeswap/localization";
import {DappClient} from "@walletconnect/push-client"
import { useWalletConnectClient } from "contexts/PushContext";
import { useExtendedProvider } from "contexts/ExtendedWagmiReactProvider";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

interface IPushSubscriptionProps {
  account: string;
  handleSubscribe: any
  handleUnSubscribe: any
  isSubscribed: any;
  isUnsubscribing: any
  isSubscribing: any
}

const PushSubscription: FC<IPushSubscriptionProps> = ({ account, handleSubscribe, handleUnSubscribe, isSubscribed, isSubscribing, isUnsubscribing }) => {

  const { toastSuccess: toast } = useToast()
  const { t } = useTranslation()


  return isSubscribed ? (
    <Flex flexDirection="column">
      <Button
      variant="primary"
        onClick={handleSubscribe}
      //   disabled={isSendingGm}
      >
        Send me a gm
      </Button>
      <Button
      variant="primary"

        onClick={handleUnSubscribe}
      //   isLoading={isUnsubscribing}
      //   disabled={isUnsubscribing}
      >
       {isUnsubscribing ? 'Unsubscribing..' : "Unsubscribe from gm"} 
      </Button>
    </Flex>
  ) : (
    <Button
    variant="primary"

      onClick={handleSubscribe}
      isLoading={isSubscribing}
      // disabled={isSubscribing}
    >
      {isUnsubscribing ? 'Subscribing.....' : "Subscribe from gm"} 
    </Button>
  );
};

export default PushSubscription;
