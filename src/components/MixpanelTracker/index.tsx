import React from 'react'
import { useHistory } from 'react-router-dom'
import mixpanel from 'mixpanel-browser'

export default function MixpanelTracker() {
  const history = useHistory()

  mixpanel.init('3370a9a9e9f196ced4d026384457ea97', { debug: true })

  React.useEffect(() => {
    trackPageView()
    history.listen(trackPageView)
  }, [history])

  function trackPageView() {
    mixpanel.track('pageview', { path: window.location.pathname })
  }
  return <></>
}
