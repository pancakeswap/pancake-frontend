// @ts-nocheck
// eslint-disable-next-line no-restricted-globals
export const selft = self as ServiceWorkerGlobalScope

selft.addEventListener('push', function onPush(event: PushEvent) {
  if (!event.data) return
  const data = event.data.json()

  event.waitUntil(
    selft.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://pancakeswap.finance/logo.png',
      image: 'https://pancakeswap.finance/logo.png',
    }),
  )
})
