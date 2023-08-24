import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { disconnect as wagmiDisconnect } from 'wagmi/actions';
import type Web3InboxProxy from '../../../w3iProxy';
import type W3iAuthFacade from '../../../w3iProxy/w3iAuthFacade';

export const useAuthState = (w3iProxy: Web3InboxProxy, proxyReady: boolean) => {
  const [accountQueryParam, setAccountQueryParam] = useState('');
  const [userPubkey, setUserPubkey] = useState<string | undefined>(undefined);
  const [authClient, setAuthClient] = useState<W3iAuthFacade | null>(null);

  useEffect(() => {
    if (proxyReady) {
      setAuthClient(w3iProxy.auth);
    }
  }, [w3iProxy, proxyReady]);

  const router = useRouter();

  const disconnect = useCallback(() => {
    setUserPubkey(undefined);
    wagmiDisconnect();
  }, [setUserPubkey]);

  useEffect(() => {
    const account = new URLSearchParams(router.asPath.split('?')[1]).get('account');

    if (account) {
      setAccountQueryParam(account);
    }
  }, [router.asPath]);

  useEffect(() => {
    if (accountQueryParam && authClient) {
      authClient.setAccount(accountQueryParam);
    }
  }, [accountQueryParam, authClient]);

  useEffect(() => {
    const account = authClient?.getAccount();
    if (account) {
      setUserPubkey(account);
    }
  }, [authClient]);

  useEffect(() => {
    const sub = authClient?.observe('auth_set_account', {
      next: ({ account }) => {
        setUserPubkey(account);
      },
    });

    return () => sub?.unsubscribe();
  }, [authClient]);

  return { userPubkey, setUserPubkey, disconnect };
};
