const config = [
  {
    title: {
      id: 999,
      fallback: 'What’s the difference between a Basic Sale and Unlimited Sale?',
    },
    description: [
      {
        id: 999,
        fallback:
          'In the Basic Sale, every user can commit a maximum of about 100 USD worth of CAKE-BNB LP Tokens. We calculate the maximum LP amount about 30 minutes before each IFO. The Basic Sale has no participation fee.',
      },
      {
        id: 999,
        fallback:
          'In the Unlimited Sale, there’s no limit to the amount of CAKE-BNB LP Tokens you can commit. However, there’s a fee for participation: see below.',
      },
    ],
  },
  {
    title: {
      id: 999,
      fallback: 'Which sale should I commit to? Can I do both?',
    },
    description: [
      {
        id: 999,
        fallback:
          'You can choose one or both at the same time! If you’re only committing a small amount, we recommend the Basic Sale first. Just remember you need a PancakeSwap Profile in order to participate.',
      },
    ],
  },
  {
    title: { id: 999, fallback: 'How much is the participation fee?' },
    description: [
      {
        id: 999,
        fallback: 'There’s only a participation fee for the Unlimited Sale: there’s no fee for the Basic Sale.',
      },
      {
        id: 999,
        fallback: 'The fee will start at 1%.',
      },
      {
        id: 999,
        fallback:
          'The 1% participation fee decreases in cliffs, based on the percentage of overflow from the “Unlimited” portion of the sale.',
      },
    ],
  },
  {
    title: { id: 999, fallback: 'Where does the participation fee go?' },
    description: [
      {
        id: 999,
        fallback:
          'We burn it. The CAKE-BNB LP tokens from the participation fee will be decomposed, then we use the BNB portion to market buy the CAKE equivalent, then finally throw all of the CAKE into the weekly token burn.',
      },
    ],
  },
  {
    title: {
      id: 999,
      fallback: 'How can I get an achievement for participating in the IFO?',
    },
    description: [
      {
        id: 999,
        fallback: 'You need to contribute a minimum of about 10 USD worth of CAKE-BNB LP Tokens to either sale.',
      },
      {
        id: 999,
        fallback:
          'You can contribute to one or both, it doesn’t matter: only your overall contribution is counted for the achievement.',
      },
    ],
  },
]
export default config
