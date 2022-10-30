import _get from 'lodash/get'

const Latinise = {
  latin_map: {
    τ: 't',
    Τ: 'T',
  },
}

const latinise = (input: string) => {
  return input.replace(/[^A-Za-z0-9[\] ]/g, (x: string) => _get(Latinise, `latin_map.${x}`) || x)
}

export default latinise
