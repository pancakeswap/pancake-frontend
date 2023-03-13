export const accurateTimer = (callback, time = 1000) => {
  let nextAt
  let timeout
  nextAt = Date.now() + time
  const wrapper = () => {
    nextAt += time
    timeout = setTimeout(wrapper, nextAt - Date.now())
    callback?.()
  }
  const cancel = () => clearTimeout(timeout)
  timeout = setTimeout(wrapper, nextAt - Date.now())
  return { cancel }
}
