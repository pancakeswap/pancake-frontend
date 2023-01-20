const getSecondsLeftFromNow = (timestamp: number, current?: number) => {
  const now = Math.floor((current || Date.now()) / 1000)

  return Number.isFinite(timestamp) && timestamp < now ? now - timestamp : 0
}

export default getSecondsLeftFromNow
