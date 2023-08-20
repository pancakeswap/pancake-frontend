/// <reference lib="WebWorker" />

// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', function (e) {
  console.log('heyyyyyyy', e)
  const data = e.data.json()
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(data.title, {
    body: data.body,
  })
})
