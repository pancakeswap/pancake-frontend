const publicVapidKey = 'BFEZ07DxapGRLITs13MKaqFPmmbKoHgNLUDn-8aFjF4eitQypUHHsYyx39RSaYvQAxWgz18zvGOXsXw0y8_WxTY'

if ('serviceWorker' in navigator) {
  registerServiceWorker().catch(console.log)
}

async function registerServiceWorker() {
  const register = await navigator.serviceWorker.register('./service-worker.js', {
    scope: '/',
  })

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVapidKey,
  })

  await fetch('http://localhost:8081/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
