const replaceBrowserHistory = (key: string, value?: string | number | null) => {
  const url = new URL(window.location.href)
  if (!value) {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, String(value))
  }
  window.history.replaceState({}, null, url)
}

export default replaceBrowserHistory
