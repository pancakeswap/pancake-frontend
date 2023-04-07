import _get from 'lodash/get'
import memoize from 'lodash/memoize'

const Latinise = {
  latin_map: {
    τ: 't',
    Τ: 'T',
  },
}

const latinise = memoize((input: string) => {
  return input.replace(/[^A-Za-z0-9[\] ]/g, (x: string) => _get(Latinise, `latin_map.${x}`) || x)
})

export default latinise
