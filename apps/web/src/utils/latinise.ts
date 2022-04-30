export const Latinise = {
  latin_map: {
    τ: 't',
    Τ: 'T',
  },
}

export const latinise = (input: string) => {
  return input.replace(/[^A-Za-z0-9[\] ]/g, (x) => Latinise.latin_map[x] || x)
}
