import Trans from 'components/Trans'
import { styled } from 'styled-components'
import { Link, Box } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are the sale types? What are the differences between them?</Trans>,
    description: [
      <Trans>In the current IFO format. There are three types of sales:</Trans>,
      <ul>
        <li>
          <Trans>Public Sales</Trans>
        </li>
        <li>
          <Trans>Private Sales</Trans>
        </li>
        <li>
          <Trans>Basic Sales</Trans>
        </li>
      </ul>,
      <Box mt="1rem">
        <Trans>There is NO requirement for participating in the Basic Sales.</Trans>
      </Box>,
      <Box mt="1rem">
        <Trans>
          To participate in Private Sales, participants will have to meet certain requirements presented on the IFO
          card. Each eligible participant will be able to commit any amount of CAKE up to the maximum commit limit,
          which is published along with the IFO voting proposal.
        </Trans>
      </Box>,
      <Box mt="1rem">
        <Trans>
          In the Public Sale, everyone with an active PancakeSwap profile can commit. However the maximum amount of CAKE
          users can commit, is equal to the number of iCAKE they have.
        </Trans>
      </Box>,
      <Box mt="1rem">
        <Trans>Learn more about iCAKE</Trans>
        <InlineLink ml="4px" external href="https://docs.pancakeswap.finance/products/ifo-initial-farm-offering/icake">
          <Trans>here</Trans>
        </InlineLink>
      </Box>,
      <Box mt="1rem">
        <Trans>And there’s a fee for participation: see below.</Trans>
      </Box>,
    ],
  },
  {
    title: <Trans>How can I get more iCAKE?</Trans>,
    description: [
      <Trans>
        Your iCAKE number for each IFOs is calculated based on your veCAKE balance at the snapshot time of each IFOs.
        Usually the snapshot time is the end time of each IFOs. Therefore, iCAKE can varies between different IFOs.
      </Trans>,
      <Box mt="1rem">
        <Trans>
          To get more iCAKE, simply get more veCAKE by locking more CAKE in your veCAKE position, or extending your
          veCAKE position.
        </Trans>
      </Box>,
    ],
  },
  {
    title: <Trans>Which sale should I commit to? Can I do both?</Trans>,
    description: [
      <Trans>You can choose one or both at the same time!</Trans>,
      <Box mt="1rem">
        <Trans>
          We recommend you to check if you are eligible to participate in the Private Sale first. In the Public Sale, if
          the amount you commit is too small, you may not receive a meaningful amount of IFO tokens.
        </Trans>
      </Box>,
      <Box mt="1rem">
        <Trans>
          Just remember: you need an active PancakeSwap Profile in order to participate in Private and Public Sales.
        </Trans>
      </Box>,
    ],
  },
  {
    title: <Trans>How much is the participation fee?</Trans>,
    description: [
      <Trans>There are two types of participation fee:</Trans>,
      <ul>
        <li>
          <Trans>Cliff</Trans>
        </li>
        <li>
          <Trans>Fixed</Trans>
        </li>
      </ul>,
      <Box mt="1rem">
        <Trans>
          In “Cliff” model, the participation fee decreases in cliffs, based on the percentage of overflow from the
          “Public Sale” portion of the IFO. In “Fixed” modal, participation fee is fixed.
        </Trans>
      </Box>,
      <Box mt="1rem">
        <Trans>
          Fees may vary between different IFOs. To learn more about the participation fees, please refer to the details
          in the IFO proposal (vote) for the specifics of the IFO you want to take part in.
        </Trans>
      </Box>,
    ],
  },
  {
    title: <Trans>Where does the participation fee go?</Trans>,
    description: [<Trans>The CAKE from the participation fee will be burnt as part of the weekly token burn.</Trans>],
  },
  {
    title: <Trans>How can I get an achievement for participating in the IFO?</Trans>,
    description: [
      <Trans>
        You need to contribute a minimum of about 10 USD worth of CAKE to either sale. You can contribute to one or
        both, it doesn’t matter: only your overall contribution is counted for the achievement.
      </Trans>,
      <Box mt="1rem">
        <Trans>Note that only BNB Chain IFOs are eligible for achievements.</Trans>
      </Box>,
    ],
  },
  {
    title: <Trans>What is the difference between an IFO and a cIFO?</Trans>,
    description: [
      <Trans>
        cIFOs are a new subtype of IFOs, designed to reward our loyal community, and also introduce our community to
        projects with slightly smaller raises.
      </Trans>,
      <Box mt="1rem">
        <Trans>Learn more about cIFO</Trans>
        <InlineLink
          ml="4px"
          external
          href="https://medium.com/pancakeswap/community-initial-farm-offering-cifo-the-new-ifo-subtype-ac1abacf66be"
        >
          <Trans>here</Trans>
        </InlineLink>
      </Box>,
    ],
  },
]
export default config
