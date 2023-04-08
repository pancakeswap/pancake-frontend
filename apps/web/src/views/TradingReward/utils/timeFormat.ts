export const timeFormat = (locale: string, time: number) => {
  if (!time) {
    return ''
  }

  return new Date(time * 1000).toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
