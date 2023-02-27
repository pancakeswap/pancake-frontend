export const accurateTimer = (callback, time = 1000) => {
  let nextAt
  let timeout
  nextAt = new Date().getTime() + time
  const wrapper = () => {
    nextAt += time
    timeout = setTimeout(wrapper, nextAt - new Date().getTime())
    callback?.()
  }
  const cancel = () => clearTimeout(timeout)
  timeout = setTimeout(wrapper, nextAt - new Date().getTime())
  return { cancel }
}
