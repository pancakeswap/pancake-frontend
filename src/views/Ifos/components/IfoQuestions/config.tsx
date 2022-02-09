import Trans from 'components/Trans'
import React from 'react'

const config = [
  {
    title: <Trans>What’s the difference between a Basic Sale and Unlimited Sale?</Trans>,
    description: [
      <Trans>
        In the Basic Sale, every user can commit a maximum of about 100 USD worth of CAKE. We calculate the maximum CAKE
        amount about 30 minutes before each IFO. The Basic Sale has no participation fee.
      </Trans>,
      <Trans>
        In the Unlimited Sale, there’s no limit to the amount of CAKE you can commit. However, there’s a fee for
        participation: see below.
      </Trans>,
    ],
  },
  {
    title: <Trans>Which sale should I commit to? Can I do both?</Trans>,
    description: [
      <Trans>
        You can choose one or both at the same time! If you’re only committing a small amount, we recommend the Basic
        Sale first. Just remember you need a PancakeSwap Profile in order to participate.
      </Trans>,
    ],
  },
  {
    title: <Trans>How much is the participation fee?</Trans>,
    description: [
      <Trans>There’s only a participation fee for the Unlimited Sale: there’s no fee for the Basic Sale.</Trans>,
      <Trans>The fee will start at 1%.</Trans>,
      <Trans>
        The 1% participation fee decreases in cliffs, based on the percentage of overflow from the “Unlimited” portion
        of the sale.
      </Trans>,
    ],
  },
  {
    title: <Trans>Where does the participation fee go?</Trans>,
    description: [<Trans>The CAKE from the participation fee will be thrown into the weekly token burn.</Trans>],
  },
  {
    title: <Trans>How can I get an achievement for participating in the IFO?</Trans>,
    description: [
      <Trans>You need to contribute a minimum of about 10 USD worth of CAKE to either sale.</Trans>,
      <Trans>
        You can contribute to one or both, it doesn’t matter: only your overall contribution is counted for the
        achievement.
      </Trans>,
    ],
  },
]
export default config
