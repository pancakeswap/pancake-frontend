// eslint-disable-next-line no-restricted-globals
self.addEventListener('push',function onPush(event) {
  const data = event.data.json()
  // eslint-disable-next-line no-restricted-globals
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://pancakeswap.finance/logo.png',
  }));
  
})
