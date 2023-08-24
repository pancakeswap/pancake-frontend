import { useState } from 'react'

export const useUiState = () => {
  const query = new URLSearchParams(window.location.search)

  const notifyEnabledQuery = query.get('notifyEnabled')
  const chatEnabledQuery = query.get('chatEnabled')
  const settingsEnabledQuery = query.get('settingsEnabled')

  const notify: boolean = notifyEnabledQuery ? JSON.parse(notifyEnabledQuery) : true
  const settings: boolean = settingsEnabledQuery ? JSON.parse(settingsEnabledQuery) : true
  const chat: boolean = chatEnabledQuery ? JSON.parse(chatEnabledQuery) : true

  const totalPagesEnabled = Number(notify) + Number(settings) + Number(chat)
  const [uiEnabled] = useState({
    notify,
    settings,
    chat,
    sidebar: totalPagesEnabled > 1
  })

  return { uiEnabled }
}
