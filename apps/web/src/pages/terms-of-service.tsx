/* eslint-disable react/no-unescaped-entities */
import { styled } from 'styled-components'
import { Flex, Text, Link } from '@pancakeswap/uikit'

export const Container = styled(Flex)`
  display: grid;
  max-width: 650px;
  margin: 50px auto;
  padding: 0px 16px;

  h1 {
    font-size: 2.25rem;
    font-width: bold;
  }

  h3 {
    margin: 1em 0px 0.5em;
    font-weight: bold;
  }

  p {
    opacity: 0.94;
    margin-bottom: 1em;
    line-height: 24px;
  }

  li {
    margin: 0.5em 0px 0px 1em;
    color: ${({ theme }) => theme.colors.text};
  }
`

const TermsOfService = () => {
  return (
    <Container>
      <Text as="h1">PancakeSwap Terms of Service</Text>
      <Text as="h3">Last modified: Feb 28, 2023</Text>
      <Text as="p">
        <Text as="span">
          These Terms of Service (the “Agreement”) explains the terms and conditions by which you may access and use
        </Text>
        <Link m="0 4px" display="inline !important" href="https://pancakeswap.finance">
          https://pancakeswap.finance
        </Link>
        <Text as="span">
          and any subdomains associated with the Website. You must read this Agreement carefully as it governs your use
          of the Website. By accessing or using the Website, you signify that you have read, understand, and agree to be
          bound by this Agreement in its entirety. If you do not agree, you are not authorized to access or use the
          Website and should not use the Website.
        </Text>
      </Text>

      <Text as="p" fontWeight="600">
        NOTICE: This Agreement contains important information, including a binding arbitration provision and a class
        action waiver, both of which impact your rights as to how disputes are resolved. The Website is only available
        to you — and you should only access the Website — if you agree completely with these terms.
      </Text>

      <Text as="h3">Introduction</Text>
      <Text as="p">
        The Website provides access to (a) a decentralized protocol on various public blockchains, including but not
        limited to BNB Chain, Aptos and Ethereum, that allow users to trade certain compatible digital assets (“the
        PancakeSwap protocol” or the “Protocol”), among other services. The Website is one, but not the exclusive, means
        of accessing the Protocol.
      </Text>
      <Text as="p">
        To access the Website, you must use non-custodial wallet software, which allows you to interact with public
        blockchains. Your relationship with that non-custodial wallet provider is governed by the applicable terms of
        service of that third party, not this Agreement. Wallets are not operated by, maintained by, or affiliated with
        us, and we do not have custody or control over the contents of your wallet and have no ability to retrieve or
        transfer its contents. By connecting your wallet to our Website, you agree to be bound by this Agreement and all
        of the terms incorporated herein by reference.
      </Text>

      <Text as="h3">Modification of this Agreement</Text>
      <Text as="p">
        <Text as="span">
          We reserve the right, in our sole discretion, to modify this Agreement from time to time. If we make any
          material modifications, we will notify you by updating the date at the top of the Agreement and by maintaining
          a current version of the Agreement at
        </Text>
        <Link m="0 4px" display="inline !important" href="https://pancakeswap.finance/terms-of-service">
          https://pancakeswap.finance/terms-of-service.
        </Link>
        <Text as="span">
          All modifications will be effective when they are posted, and your continued accessing or use of the Website
          will serve as confirmation of your acceptance of those modifications. If you do not agree with any
          modifications to this Agreement, you must immediately stop accessing and using the Website.
        </Text>
      </Text>

      <Text as="h3">Description of Services provided through the Website</Text>
      <Text as="p">The Website provides a web or mobile-based means of accessing the Protocol.</Text>

      <Text as="h3">Website for accessing Protocol</Text>
      <Text as="p">
        The Website is distinct from the Protocol and is one, but not the exclusive, means of accessing the Protocol.
        The Protocol itself has three versions, designated as v1, v2, and v3, each of which comprises open-source or
        source-available self-executing smart contracts that are deployed on various public blockchains, such as BNB
        Chain, Aptos and Ethereum. PancakeSwap does not control or operate any version of the Protocol on any blockchain
        network. By using the Website, you understand that you are not buying or selling digital assets from us and that
        we do not operate any liquidity pools on the Protocol or control trade execution on the Protocol. When traders
        pay fees for trades, those fees accrue to liquidity providers for the Protocol. As a general matter, the
        PancakeSwap team is not a liquidity provider into Protocol liquidity pools and liquidity providers are
        independent third parties. The Protocol was initially deployed on the BNB Chain blockchain, and has since been
        deployed on several other blockchain networks.
      </Text>

      <Text as="h3">Eligibility</Text>
      <Text as="p">
        To access or use the Website, you must be able to form a legally binding contract with us. Accordingly, you
        represent that you are at least the age of majority in your jurisdiction (e.g., 18 years old in the United
        States) and have the full right, power, and authority to enter into and comply with the terms and conditions of
        this Agreement on behalf of yourself and any company or legal entity for which you may access or use the
        Website.
      </Text>
      <Text as="p">
        You further represent that you are not (a) the subject of economic or trade sanctions administered or enforced
        by any governmental authority or otherwise designated on any list of prohibited or restricted parties (including
        but not limited to the list maintained by the Office of Foreign Assets Control of the U.S. Department of the
        Treasury) or (b) a citizen, resident, or organized in a jurisdiction or territory that is the subject of
        comprehensive country-wide, territory-wide, or regional economic sanctions by the United States. Finally, you
        represent that your access and use of the Website will fully comply with all applicable laws and regulations,
        and that you will not access or use the Website to conduct, promote, or otherwise facilitate any illegal
        activity.
      </Text>

      <Text as="h3">Intellectual Property Rights</Text>
      <Text as="p">
        PancakeSwap owns all intellectual property and other rights in the Website and its contents, including (but not
        limited to) software, text, images, trademarks, service marks, copyrights, patents, designs, and its “look and
        feel.” Unlike the Website, versions 1-3 of the Protocol are comprised entirely of open-source or
        source-available software running on public blockchains.
      </Text>
      <Text as="p">
        By using the Website to list, post, promote, or display NFTs, you grant us a worldwide, non-exclusive,
        sublicensable, royalty-free license to use, copy, modify, and display any content, including but not limited to
        text, materials, images, files, communications, comments, feedback, suggestions, ideas, concepts, questions,
        data, or otherwise, that you post on or through the Website for our current and future business purposes,
        including to provide, promote, and improve the services. This includes any digital file, art, or other material
        linked to or associated with any NFTs that are displayed.
      </Text>
      <Text as="p">
        You represent and warrant that you have, or have obtained, all rights, licenses, consents, permissions, power
        and/or authority necessary to grant the rights granted herein for any NFTs that you list, post, promote, or
        display on or through the Website. You represent and warrant that such content does not contain material subject
        to copyright, trademark, publicity rights, or other intellectual property rights, unless you have necessary
        permission or are otherwise legally entitled to post the material and to grant us the license described above,
        and that the content does not violate any laws.
      </Text>

      <Text as="h3">Additional Rights</Text>
      <Text as="p">
        We reserve the following rights, which do not constitute obligations of ours: (a) with or without notice to you,
        to modify, substitute, eliminate or add to the Website; (b) to review, modify, filter, disable, delete and
        remove any and all content and information from the Website; and (c) to cooperate with any law enforcement,
        court or government investigation or order or third party requesting or directing that we disclose information
        or content or information that you provide.
      </Text>

      <Text as="h3">Prohibited Activity</Text>
      <Text as="p">
        You agree not to engage in, or attempt to engage in, any of the following categories of prohibited activity in
        relation to your access and use of the Website:
      </Text>
      <ul>
        <li>
          Intellectual Property Infringement. Activity that infringes on or violates any copyright, trademark, service
          mark, patent, right of publicity, right of privacy, or other proprietary or intellectual property rights under
          the law.
        </li>
        <li>
          Cyberattack. Activity that seeks to interfere with or compromise the integrity, security, or proper
          functioning of any computer, server, network, personal device, or other information technology system,
          including (but not limited to) the deployment of viruses and denial of service attacks.
        </li>
        <li>
          Fraud and Misrepresentation. Activity that seeks to defraud us or any other person or entity, including (but
          not limited to) providing any false, inaccurate, or misleading information in order to unlawfully obtain the
          property of another.
        </li>
        <li>
          Market Manipulation. Activity that violates any applicable law, rule, or regulation concerning the integrity
          of trading markets, including (but not limited to) the manipulative tactics commonly known as “rug pulls”,
          pumping and dumping, and wash trading.
        </li>
        <li>
          Securities and Derivatives Violations. Activity that violates any applicable law, rule, or regulation
          concerning the trading of securities or derivatives, including (but not limited to) the unregistered offering
          of securities and the offering of leveraged and margined commodity products to retail customers in the United
          States.
        </li>
        <li>
          Sale of Stolen Property. Buying, selling, or transferring of stolen items, fraudulently obtained items, items
          taken without authorization, and/or any other illegally obtained items.
        </li>
        <li>
          Data Mining or Scraping. Activity that involves data mining, robots, scraping, or similar data gathering or
          extraction methods of content or information from the Website.
        </li>
        <li>
          Objectionable Content. Activity that involves soliciting information from anyone under the age of 18 or that
          is otherwise harmful, threatening, abusive, harassing, tortious, excessively violent, defamatory, vulgar,
          obscene, pornographic, libelous, invasive of another’s privacy, hateful, discriminatory, or otherwise
          objectionable.
        </li>
        <li>
          Any Other Unlawful Conduct. Activity that violates any applicable law, rule, or regulation of the United
          States or another relevant jurisdiction, including (but not limited to) the restrictions and regulatory
          requirements imposed by U.S. law.
        </li>
      </ul>

      <Text as="h3">Initial Farm Offering</Text>
      <Text as="p">
        You represent that you are not a user from the following countries or regions when participating in our Initial
        Farm Offerings:
      </Text>
      <Text as="p">
        Belarus, Cuba, Crimea Region, Democratic Republic of Congo, Iran, Iraq, New Zealand, North Korea, South Sudan,
        Sudan, Syria, United States of America and its territories (American Samoa, Guam, Puerto Rico, the Northern
        Mariana Islands, and the U.S. Virgin Islands), Zimbabwe.
      </Text>

      <Text as="h3">Not Registered with the SEC or Any Other Agency</Text>
      <Text as="p">
        We are not registered with the U.S. Securities and Exchange Commission as a national securities exchange or in
        any other capacity. You understand and acknowledge that we do not broker trading orders on your behalf. We also
        do not facilitate the execution or settlement of your trades, which occur entirely on the public distributed
        blockchains like Ethereum. As a result, we do not (and cannot) guarantee market best pricing or best execution
        through the Website or when using our Smart Router feature, which routes trades across liquidity pools on the
        Protocol only. Any references in the Website to “best price” do not constitute a representation or warranty
        about pricing available through the Website, on the Protocol, or elsewhere.
      </Text>

      <Text as="h3">Non-Solicitation; No Investment Advice</Text>
      <Text as="p">
        You agree and understand that: (a) all trades you submit through the Website are considered unsolicited, which
        means that they are solely initiated by you; (b) you have not received any investment advice from us in
        connection with any trades, including those you place via our Smart Router API; and (c) we do not conduct a
        suitability review of any trades you submit.
      </Text>
      <Text as="p">
        We may provide information about tokens in the Website sourced from third-party data partners through features
        such as rarity scores, token explorer or token lists (which includes the PancakeSwap default token list and
        PancakeSwap expanded list hosted at tokenlists.org). We may also provide warning labels for certain tokens. The
        provision of informational materials does not make trades in those tokens solicited; we are not attempting to
        induce you to make any purchase as a result of information provided. All such information provided by the
        Website is for informational purposes only and should not be construed as investment advice or a recommendation
        that a particular token is a safe or sound investment. You should not take, or refrain from taking, any action
        based on any information contained in the Website. By providing token information for your convenience, we do
        not make any investment recommendations to you or opine on the merits of any transaction or opportunity. You
        alone are responsible for determining whether any investment, investment strategy or related transaction is
        appropriate for you based on your personal investment objectives, financial circumstances, and risk tolerance.
      </Text>

      <Text as="h3">Non-Custodial and No Fiduciary Duties</Text>
      <Text as="p">
        The Website is a purely non-custodial application, meaning we do not ever have custody, possession, or control
        of your digital assets at any time. It further means you are solely responsible for the custody of the
        cryptographic private keys to the digital asset wallets you hold and you should never share your wallet
        credentials or seed phrase with anyone. We accept no responsibility for, or liability to you, in connection with
        your use of a wallet and make no representations or warranties regarding how the Website will operate with any
        specific wallet. Likewise, you are solely responsible for any associated wallet and we are not liable for any
        acts or omissions by you in connection with or as a result of your wallet being compromised.
      </Text>
      <Text as="p">
        This Agreement is not intended to, and does not, create or impose any fiduciary duties on us. To the fullest
        extent permitted by law, you acknowledge and agree that we owe no fiduciary duties or liabilities to you or any
        other party, and that to the extent any such duties or liabilities may exist at law or in equity, those duties
        and liabilities are hereby irrevocably disclaimed, waived, and eliminated. You further agree that the only
        duties and obligations that we owe you are those set out expressly in this Agreement.
      </Text>

      <Text as="h3">Compliance and Tax Obligations</Text>
      <Text as="p">
        The Website may not be available or appropriate for use in your jurisdiction. By accessing or using the Website,
        you agree that you are solely and entirely responsible for compliance with all laws and regulations that may
        apply to you.
      </Text>
      <Text as="p">
        Specifically, your use of the Website or the Protocol may result in various tax consequences, such as income or
        capital gains tax, value-added tax, goods and services tax, or sales tax in certain jurisdictions.It is your
        responsibility to determine whether taxes apply to any transactions you initiate or receive and, if so, to
        report and/or remit the correct tax to the appropriate tax authority.
      </Text>

      <Text as="h3">Assumption of Risk</Text>
      <Text as="p">
        By accessing and using the Website, you represent that you are financially and technically sophisticated enough
        to understand the inherent risks associated with using cryptographic and blockchain-based systems, and that you
        have a working knowledge of the usage and intricacies of digital assets such as ether (ETH), so-called
        stablecoins, and other digital tokens such as those following the Ethereum Token Standard (ERC-20), or standards
        of any other digital tokens which are transacted on PancakeSwap.
      </Text>
      <Text as="p">
        In particular, you understand that the markets for these digital assets are nascent and highly volatile due to
        risk factors including (but not limited to) adoption, speculation, technology, security, and regulation. You
        understand that anyone can create a token, including fake versions of existing tokens and tokens that falsely
        claim to represent projects, and acknowledge and accept the risk that you may mistakenly trade those or other
        tokens. So-called stablecoins may not be as stable as they purport to be, may not be fully or adequately
        collateralized, and may be subject to panics and runs.
      </Text>
      <Text as="p">
        Further, you understand that smart contract transactions automatically execute and settle, and that
        blockchain-based transactions are irreversible when confirmed. You acknowledge and accept that the cost and
        speed of transacting with cryptographic and blockchain-based systems such as Ethereum are variable and may
        increase dramatically at any time. You further acknowledge and accept the risk of selecting to trade in Expert
        Modes, which can expose you to potentially significant price slippage and higher costs.
      </Text>
      <Text as="p">
        If you act as a liquidity provider to the Protocol through the Website, you understand that your digital assets
        may lose some or all of their value while they are supplied to the Protocol through the Website due to the
        fluctuation of prices of tokens in a trading pair or liquidity pool.
      </Text>
      <Text as="p">
        Finally, you understand that we do not create, own, or operate cross-chain bridges and we do not make any
        representation or warranty about the safety or soundness of any cross-chain bridge, including its use for
        PancakeSwap governance.
      </Text>
      <Text as="p">
        In summary, you acknowledge that we are not responsible for any of these variables or risks, do not own or
        control the Protocol, and cannot be held liable for any resulting losses that you experience while accessing or
        using the Website. Accordingly, you understand and agree to assume full responsibility for all of the risks of
        accessing and using the Website to interact with the Protocol.
      </Text>

      <Text as="h3">Third-Party Resources and Promotions</Text>
      <Text as="p">
        The Website may contain references or links to third-party resources, including (but not limited to)
        information, materials, products, or services, that we do not own or control. In addition, third parties may
        offer promotions related to your access and use of the Website. We do not approve, monitor, endorse, warrant or
        assume any responsibility for any such resources or promotions. If you access any such resources or participate
        in any such promotions, you do so at your own risk, and you understand that this Agreement does not apply to
        your dealings or relationships with any third parties. You expressly relieve us of any and all liability arising
        from your use of any such resources or participation in any such promotions.
      </Text>

      <Text as="h3">Release of Claims</Text>
      <Text as="p">
        You expressly agree that you assume all risks in connection with your access and use of the Website. You further
        expressly waive and release us from any and all liability, claims, causes of action, or damages arising from or
        in any way relating to your use of the Website. If you are a California resident, you waive the benefits and
        protections of California Civil Code § 1542, which provides: "[a] general release does not extend to claims that
        the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing
        the release and that, if known by him or her, would have materially affected his or her settlement with the
        debtor or released party."
      </Text>

      <Text as="h3">Indemnity</Text>
      <Text as="p">
        You agree to hold harmless, release, defend, and indemnify us and our officers, directors, employees,
        contractors, agents, affiliates, and subsidiaries from and against all claims, damages, obligations, losses,
        liabilities, costs, and expenses arising from: (a) your access and use of the Website; (b) your violation of any
        term or condition of this Agreement, the right of any third party, or any other applicable law, rule, or
        regulation; and (c) any other party's access and use of the Website with your assistance or using any device or
        account that you own or control.
      </Text>

      <Text as="h3">No Warranties</Text>
      <Text as="p">
        The Website is provided on an "AS IS" and "AS AVAILABLE" basis. TO THE FULLEST EXTENT PERMITTED BY LAW, WE
        DISCLAIM ANY REPRESENTATIONS AND WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING (BUT
        NOT LIMITED TO) THE WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. You acknowledge and
        agree that your use of the Website is at your own risk. We do not represent or warrant that access to the
        Website will be continuous, uninterrupted, timely, or secure; that the information contained in the Website will
        be accurate, reliable, complete, or current; or that the Website will be free from errors, defects, viruses, or
        other harmful elements. No advice, information, or statement that we make should be treated as creating any
        warranty concerning the Website. We do not endorse, guarantee, or assume responsibility for any advertisements,
        offers, or statements made by third parties concerning the Website.
      </Text>
      <Text as="p">
        Similarly, the Protocol is provided "AS IS", at your own risk, and without warranties of any kind. Although we
        contributed to the initial code for the Protocol, we do not provide, own, or control the Protocol, which is run
        autonomously without any headcount by smart contracts deployed on various blockchains. Upgrades and
        modifications to the Protocol are generally managed in a community-driven way by holders of the CAKE token. No
        developer or entity involved in creating the Protocol will be liable for any claims or damages whatsoever
        associated with your use, inability to use, or your interaction with other users of, the Protocol, including any
        direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits,
        cryptocurrencies, tokens, or anything else of value. We do not endorse, guarantee, or assume responsibility for
        any advertisements, offers, or statements made by third parties concerning the Website.
      </Text>

      <Text as="h3">Limitation of Liability</Text>
      <Text as="p">
        UNDER NO CIRCUMSTANCES SHALL WE OR ANY OF OUR OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AGENTS, AFFILIATES,
        OR SUBSIDIARIES BE LIABLE TO YOU FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY
        DAMAGES, INCLUDING (BUT NOT LIMITED TO) DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE
        PROPERTY, ARISING OUT OF OR RELATING TO ANY ACCESS OR USE OF THE INTERFACE, NOR WILL WE BE RESPONSIBLE FOR ANY
        DAMAGE, LOSS, OR INJURY RESULTING FROM HACKING, TAMPERING, OR OTHER UNAUTHORIZED ACCESS OR USE OF THE INTERFACE
        OR THE INFORMATION CONTAINED WITHIN IT. WE ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY: (A) ERRORS, MISTAKES,
        OR INACCURACIES OF CONTENT; (B) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM ANY
        ACCESS OR USE OF THE INTERFACE; (C) UNAUTHORIZED ACCESS OR USE OF ANY SECURE SERVER OR DATABASE IN OUR CONTROL,
        OR THE USE OF ANY INFORMATION OR DATA STORED THEREIN; (D) INTERRUPTION OR CESSATION OF FUNCTION RELATED TO THE
        INTERFACE; (E) BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH THE INTERFACE;
        (F) ERRORS OR OMISSIONS IN, OR LOSS OR DAMAGE INCURRED AS A RESULT OF THE USE OF, ANY CONTENT MADE AVAILABLE
        THROUGH THE INTERFACE; AND (G) THE DEFAMATORY, OFFENSIVE, OR ILLEGAL CONDUCT OF ANY THIRD PARTY.
      </Text>

      <Text as="h3">Dispute Resolution</Text>
      <Text as="p">
        We will use our best efforts to resolve any potential disputes through informal, good faith negotiations. If a
        potential dispute arises, you must contact us by sending an email to info@pancakeswap.come so that we can
        attempt to resolve it without resorting to formal dispute resolution. If we aren't able to reach an informal
        resolution within sixty days of your email, then you and we both agree to resolve the potential dispute
        according to the process set forth below.
      </Text>
      <Text as="p">
        Any claim or controversy arising out of or relating to the Website, this Agreement, or any other acts or
        omissions for which you may contend that we are liable, including (but not limited to) any claim or controversy
        as to arbitrability ("Dispute"), shall be finally and exclusively settled by arbitration under the Arbitration
        Rules of the Hong Kong International Arbitration Centre. You understand that you are required to resolve all
        Disputes by binding arbitration. The arbitration shall be held on a confidential basis before a single
        arbitrator, who shall be selected pursuant to Arbitration Rules of the Centre. The arbitration will be held in
        Hong Kong, unless you and we both agree to hold it elsewhere. Unless we agree otherwise, the arbitrator may not
        consolidate your claims with those of any other party. Any judgment on the award rendered by the arbitrator may
        be entered in any court of competent jurisdiction.
      </Text>

      <Text as="h3">Class Action and Jury Trial Waiver</Text>
      <Text as="p">
        You must bring any and all Disputes against us in your individual capacity and not as a plaintiff in or member
        of any purported class action, collective action, private attorney general action, or other representative
        proceeding. This provision applies to class arbitration. You and we both agree to waive the right to demand a
        trial by jury.
      </Text>

      <Text as="h3">Governing Law</Text>
      <Text as="p">
        You agree that the laws of Hong Kong, without regard to principles of conflict of laws, govern this Agreement
        and any Dispute between you and us. You further agree that the Website shall be deemed to be based solely in the
        State of Hong Kong, and that although the Website may be available in other jurisdictions, its availability does
        not give rise to general or specific personal jurisdiction in any forum outside Hong Kong. Any arbitration
        conducted pursuant to this Agreement shall be governed by the Arbitration Rules of the Centre. You agree that
        the courts of Hong Kong are the proper forum for any appeals of an arbitration award or for court proceedings in
        the event that this Agreement's binding arbitration clause is found to be unenforceable.
      </Text>

      <Text as="h3">Entire Agreement</Text>
      <Text as="p">
        These terms constitute the entire agreement between you and us with respect to the subject matter hereof. This
        Agreement supersedes any and all prior or contemporaneous written and oral agreements, communications and other
        understandings (if any) relating to the subject matter of the terms.
      </Text>

      <Text as="h3">Gas Fees</Text>
      <Text as="p">
        Blockchain transactions require the payment of transaction fees to the appropriate network (“Gas Fees”). Except
        as otherwise expressly set forth in the terms of another offer by PancakeSwap, you will be solely responsible to
        pay the Gas Fees for any transaction that you initiate.
      </Text>
    </Container>
  )
}

TermsOfService.chains = []

export default TermsOfService
