import { ContextApi } from 'contexts/Localization/types'
import { Ifo } from 'config/constants/types'

const config = (t: ContextApi['t'], ifo: Ifo) => {
  return [
    {
      title: t('What’s the difference between a Basic Sale and Unlimited Sale?'),
      description: [
        t(
          'In the Basic Sale, every user can commit a maximum of about 100 USD worth of %symbol%. We calculate the maximum %symbol% amount about 30 minutes before each IFO. The Basic Sale has no participation fee.',
          { symbol: ifo.currency.symbol },
        ),
        t(
          'In the Unlimited Sale, there’s no limit to the amount of %symbol% you can commit. However, there’s a fee for participation: see below.',
          { symbol: ifo.currency.symbol },
        ),
      ],
    },
    {
      title: t('Which sale should I commit to? Can I do both?'),
      description: [
        t(
          'You can choose one or both at the same time! If you’re only committing a small amount, we recommend the Basic Sale first. Just remember you need a PancakeSwap Profile in order to participate.',
        ),
      ],
    },
    {
      title: t('How much is the participation fee?'),
      description: [
        t('There’s only a participation fee for the Unlimited Sale: there’s no fee for the Basic Sale.'),
        t('The fee will start at 1%.'),
        t(
          'The 1% participation fee decreases in cliffs, based on the percentage of overflow from the “Unlimited” portion of the sale.',
        ),
      ],
    },
    {
      title: t('Where does the participation fee go?'),
      description: [
        t('The %symbol% from the participation fee will be thrown into the weekly token burn.', {
          symbol: ifo.currency.symbol,
        }),
      ],
    },
    {
      title: t('How can I get an achievement for participating in the IFO?'),
      description: [
        t('You need to contribute a minimum of about 10 USD worth of %symbol% to either sale.', {
          symbol: ifo.currency.symbol,
        }),
        t(
          'You can contribute to one or both, it doesn’t matter: only your overall contribution is counted for the achievement.',
        ),
      ],
    },
  ]
}
export default config
