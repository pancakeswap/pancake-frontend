export const metric = {
  time: (label: string) => {
    const key = `${label} at ${Date.now()}`
    console.time(key)
    return key
  },

  timeLog: (label: string, ...args: any[]) => {
    return console.timeLog(label, ...args)
  },

  timeEnd: (label: string) => {
    return console.timeEnd(label)
  },
}
