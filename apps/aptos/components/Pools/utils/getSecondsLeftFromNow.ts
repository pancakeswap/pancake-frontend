const getSecondsLeftFromNow = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000)

  return Number.isFinite(timestamp) && timestamp < now ? now - timestamp : 0
}

export default getSecondsLeftFromNow
