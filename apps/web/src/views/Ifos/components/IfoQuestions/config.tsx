import Trans from 'components/Trans'

const config = [
  {
    title: <Trans>What’s the difference between a Public Sale and Private Sale?</Trans>,
    description: [
      <Trans>
        In the new IFO 3.1 format. There is a brand new Private Sale. To participate, participants will have to meet
        certain requirements presented on the IFO card. Each eligible participant will be able to commit any amount of
        CAKE up to the maximum commit limit, which is published along with the IFO voting proposal. The Private Sale has
        no participation fee.
      </Trans>,
      <Trans>
        In the Public Sale, everyone with an active PancakeSwap profile can commit. However the maximum amount of CAKE
        user can commit, is equal to the average CAKE balance in the IFO CAKE pool prior to the IFO. And there’s a fee
        for participation: see below.
      </Trans>,
    ],
  },
  {
    title: <Trans>Which sale should I commit to? Can I do both?</Trans>,
    description: [
      <Trans>You can choose one or both at the same time!</Trans>,
      <Trans>
        We recommend you to check if you are eligible to participate in the Private Sale first. In the Public Sale, if
        the amount you commit is too small, you may not receive a meaningful amount of IFO tokens.
      </Trans>,
      <Trans>Just remember you need an active PancakeSwap Profile in order to participate.</Trans>,
    ],
  },
  {
    title: <Trans>How much is the participation fee?</Trans>,
    description: [
      <Trans>There’s only a participation fee for the Public Sale: there’s no fee for the Private Sale.</Trans>,
      <Trans>The fee will start at 0.5%.</Trans>,
      <Trans>
        The 1% participation fee decreases in cliffs, based on the percentage of overflow from the “Public Sale” portion
        of the IFO.
      </Trans>,
    ],
  },
  {
    title: <Trans>Where does the participation fee go?</Trans>,
    description: [<Trans>The CAKE from the participation fee will be burnt as part of the weekly token burn.</Trans>],
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
