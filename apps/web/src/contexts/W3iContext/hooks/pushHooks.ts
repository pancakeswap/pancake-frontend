import type { NotifyClientTypes } from '@walletconnect/notify-client'
import { EventEmitter } from 'events'
import { useCallback, useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
import { noop } from 'rxjs'
import type Web3InboxProxy from '../../../w3iProxy'
import type { W3iPushClient } from '../../../w3iProxy'
import { JsCommunicator } from '../../../w3iProxy/externalCommunicators/jsCommunicator'
import { useAuthState } from './authHooks'
import { useUiState } from './uiHooks'
import { useAccount } from 'wagmi'

export const usePushState = (w3iProxy: Web3InboxProxy, proxyReady: boolean, dappOrigin: string) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    NotifyClientTypes.NotifySubscription[]
  >([])

  // const { pathname } = useLocation()
  const [emitter] = useState(new EventEmitter())

  const { address: userPubkey } = useAccount()
  // const { uiEnabled } = useUiState()

  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const [registeredKey, setRegistered] = useState<string | null>(null)

  const [pushClient, setPushClient] = useState<W3iPushClient | null>(null)

  useEffect(() => {
    if (proxyReady) {
      setPushClient(w3iProxy.notify)
    }
  }, [w3iProxy, proxyReady])

  const refreshPushState = useCallback(() => {
    if (!pushClient || !userPubkey) {
      return
    }

    pushClient.getActiveSubscriptions({ account: `eip155:1:${userPubkey}` }).then(subscriptions => {
      setActiveSubscriptions(Object.values(subscriptions))
    })
  }, [pushClient, userPubkey])

  useEffect(() => {
    // Account for sync init
    const timeoutId = setTimeout(() => refreshPushState(), 100)

    return () => clearTimeout(timeoutId)
  }, [refreshPushState])

  const handleRegistration = useCallback(
    async (key: string) => {
      console.log(pushClient && key)
      if (pushClient && key) {
        try {
          const identityKey = await pushClient.register({ account: `eip155:1:${key}` })
          console.log('yooooooooooooooooooooooooo')
          setRegisterMessage(null)
          setRegistered(identityKey)
          refreshPushState()
        } catch (error) {
          setRegisterMessage(null)
        }
      }
    },
    [pushClient, refreshPushState, setRegisterMessage]
  )

  useEffect(() => {
    /*
     * No need to register if chat is enabled since it will handle registration
     * notify.register is disabled in favor of chat.register since
     * chat.register performs an extra step.
     */
    if (userPubkey) {
      handleRegistration(userPubkey)
    } else {
      setRegisterMessage(null)
    }
  }, [handleRegistration, setRegisterMessage, userPubkey])

  useEffect(() => {
    if (!pushClient) {
      return noop
    }

    const pushSignatureRequestedSub = pushClient.observe('notify_signature_requested', {
      next: ({ message }) => setRegisterMessage(message)
    })

    const pushSignatureRequestCancelledSub = pushClient.observe(
      'notify_signature_request_cancelled',
      {
        next: () => setRegisterMessage(null)
      }
    )

    const pushSubscriptionSub = pushClient.observe('notify_subscription', {
      next: refreshPushState
    })
    const pushDeleteSub = pushClient.observe('notify_delete', {
      next: refreshPushState
    })
    const pushUpdateSub = pushClient.observe('notify_update', {
      next: refreshPushState
    })

    const syncUpdateSub = pushClient.observe('sync_update', {
      next: refreshPushState
    })

    return () => {
      // PushRequestSub.unsubscribe()
      pushSubscriptionSub.unsubscribe()
      syncUpdateSub.unsubscribe()
      pushUpdateSub.unsubscribe()
      pushDeleteSub.unsubscribe()
      pushSignatureRequestedSub.unsubscribe()
      pushSignatureRequestCancelledSub.unsubscribe()
    }
  }, [pushClient, refreshPushState])

  // Events used exclusively when in an iframe/widget-mode
  useEffect(() => {
    if (!pushClient || !dappOrigin) {
      return noop
    }

    const pushMessageSub = pushClient.observe('notify_message', {
      next: message => {
        /*
         * Due to the fact that data is synced, push_message events can be triggered
         * from subscriptions unrelated to the one related to the dappOrigin
         */
        if (message.params.message.url !== dappOrigin) {
          return
        }

        const communicator = new JsCommunicator(emitter)
        communicator.postToExternalProvider(
          'dapp_push_notification',
          {
            notification: message.params.message
          },
          'notify'
        )
      }
    })

    const pushSubscriptionSub = pushClient.observe('notify_subscription', {
      next: message => {
        /*
         * Due to the fact that data is synced, notify_subscription events can be triggered
         * from dapps unrelated to the one owning the dappOrigin
         */
        if (message.params.subscription?.metadata.url !== dappOrigin) {
          return
        }

        const communicator = new JsCommunicator(emitter)
        communicator.postToExternalProvider('dapp_subscription_settled', {}, 'notify')
      }
    })

    return () => {
      pushMessageSub.unsubscribe()
      pushSubscriptionSub.unsubscribe()
    }
  }, [dappOrigin, pushClient, emitter])

  return { activeSubscriptions, registeredKey, registerMessage, pushClient, refreshPushState }
}
