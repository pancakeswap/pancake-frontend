export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return Promise.reject(new Error('This browser does not support desktop push notifications'))
  }

  console.log('NOTI PERM', Notification.permission)
  switch (Notification.permission) {
    case 'granted':
      return Promise.resolve()
    case 'denied':
      return Promise.reject(new Error('User does not want to receive notifications'))
    default:
      return Notification.requestPermission()
  }
}
