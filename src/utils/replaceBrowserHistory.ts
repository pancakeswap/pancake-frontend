const replaceBrowserHistory = (key, value) => {
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)
  window.history.replaceState({}, null, url)
}

export default replaceBrowserHistory
