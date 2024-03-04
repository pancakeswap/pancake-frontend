import React from 'react'
import { Provider } from 'react-redux'

import { LanguageProvider } from '@pancakeswap/localization'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import { dark, ModalProvider, UIKitProvider } from '@pancakeswap/uikit'
import { Store } from '@reduxjs/toolkit'
import { wagmiConfig } from './utils/wagmi'

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  return (
    <UIKitProvider theme={dark} {...props}>
      {children}
    </UIKitProvider>
  )
}

const queryClient = new QueryClient()

export const Widget: React.FC<
  React.PropsWithChildren<{ store: Store; children: React.ReactNode; dehydratedState: any }>
> = ({ children, store, dehydratedState }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <WagmiConfig config={wagmiConfig}>
          <Provider store={store}>
            <LanguageProvider>
              <StyledUIKitProvider>
                <ModalProvider>{children}</ModalProvider>
              </StyledUIKitProvider>
            </LanguageProvider>
          </Provider>
        </WagmiConfig>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}
