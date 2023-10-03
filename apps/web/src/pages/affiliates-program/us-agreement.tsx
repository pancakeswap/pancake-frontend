import { Text, Link } from '@pancakeswap/uikit'
import { Container } from 'pages/terms-of-service'
import AffiliatesProgramLayout from 'views/AffiliatesProgram/components/AffiliatesProgramLayout'

const UsAgreement = () => {
  return (
    <AffiliatesProgramLayout>
      <Container>
        <Text as="h1">PancakeSwap Affiliate Program Agreement</Text>
        <Text as="h3">Last modified: Sep 1, 2023</Text>
        <Text as="p">
          This PancakeSwap Affiliate Program Agreement (“<strong>Agreement”</strong>) is a legal contract between you (“
          <strong>Affiliate”</strong>) and PancakeSwap that applies to your participation in the PancakeSwap Affiliate
          Program (“Program”). In this Agreement, “<strong>PancakeSwap</strong>,” “<strong>we</strong>” or “
          <strong>us</strong>” means PancakeSwap. If you are participating or registering on behalf of a business, then
          the term “<strong>you</strong>” means such business, and you represent and warrant that you have authority to
          bind that business to this Agreement. By participating or registering to participate in the Program, or
          otherwise indicating your acceptance of this Agreement (such as by clicking a button or checking a box on a
          web page), you agree to this Agreement which may be amended from time to time by PancakeSwap.
        </Text>

        <Text as="h3">1. Program Overview</Text>
        <Text as="p">
          1.1 The Program offers you the opportunity to get paid different commission rates, by means of inviting new
          users (“<strong>Referrals”</strong>) to register and trade on PancakeSwap, in accordance with the terms of
          this Agreement.
        </Text>
        <Text as="p">
          1.2 A Referral must be a new user and must not have interacted or signed with the PancakeSwap platform or used
          any of PancakeSwap’s services (including but not limited to V2, V3 swapping services, perpetual trading,
          Non-Fungible Tokens and related services, initial farm offerings and similar offerings) (“PancakeSwap
          Services”).
        </Text>

        <Text as="h3">2. Commissions for swap trades</Text>
        <Text as="p">
          2.1 Subject to this Agreement (and especially Clause 5.2), you are eligible for commissions at the following
          rates on the following fees:
        </Text>
        <Text as="p">
          (a) <strong>3</strong>% on trading fees paid by your Referrals on PancakeSwap V2 and PancakeSwap V3, limited
          to swap trades on the BNB Smart Chain, Ethereum chain, Polygon zkEVM, zkSync Era, Arbitrum One, Linea, and
          Base chain only; and
        </Text>
        <Text as="p">
          (b) <strong>3</strong>% on trading fees paid by your Referrals on StableSwap, limited to swap trades on the
          BNB Smart Chain only.
        </Text>
        <Text as="p">2.2 To be eligible for commissions, the swap trades must have:</Text>
        <Text as="p">(a) a token pair that:</Text>
        <Text as="p">
          <Text as="span">(i) Is in the following Pancake Swap token lists</Text>
          <Text as="p">
            BNB Smart Chain:
            <Link href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-extended.json">
              https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-extended.json
            </Link>
          </Text>
          <Text as="p">
            Arbitrum One:
            <Link href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-arbitrum-default.json">
              https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-arbitrum-default.json
            </Link>
          </Text>
          <Text as="p">
            Base:
            <Link href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-base-default.json">
              https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-base-default.json
            </Link>
          </Text>
          <Text as="p">
            Ethereum:
            <Link href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-eth-default.json">
              https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-eth-default.json
            </Link>
          </Text>
          <Text as="p">
            Linea:
            <Link href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-linea-default.json">
              https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-linea-default.json
            </Link>
          </Text>
          <Text as="p">
            Polygon zkEVM:
            <Link href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-polygon-zkevm-default.json">
              https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-polygon-zkevm-default.json
            </Link>
          </Text>
          <Text as="p">
            zkSync Era:
            <Link href="https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-zksync-default.json">
              https://tokenlists.org/token-list?url=https://tokens.pancakeswap.finance/pancakeswap-zksync-default.json
            </Link>
          </Text>
          <Text as="span">; and</Text>
        </Text>
        <Text as="p">
          (ii) includes at least 1 major token (i.e., BNB, BTC, BUSD, ETH, MATIC, ARB, DAI, USDT and/or USDC)
        </Text>
        <Text as="p">
          (b) a slippage (i.e., difference between a trade&apos;s expected or requested price and the price at which the
          trade is effectively executed) of less than 10%
        </Text>

        <Text as="h3">3. Determination and Calculation of Commissions</Text>
        <Text as="p">
          3.1 We will provide you with a unique referral link which will allow our system to track your Referrals and
          their trading activities. We will only pay commissions for Referrals who have signed up through your unique
          referral link. We will not pay commissions if someone says they signed up through you but such a sign up was
          not done through the referral link.
        </Text>
        <Text as="p">3.2 All commissions will be paid out in CAKE tokens.</Text>
        <Text as="p">
          3.3 All commissions are calculated upon the completion of every on-chain transaction and denominated in U.S.
          dollars as follows. This means that:
        </Text>
        <Text as="p">
          (a) At or around the time that the trading fees are paid by the Referral, we will calculate the prevailing USD
          price of the trading fees (and your commissions which is a percentage of that) using the prevailing USD price
          of the tokens that the trading fees are denominated in (“<strong>Trading Fees Denomination</strong>”) at that
          time; and
        </Text>
        <Text as="p">
          (b) At or around the time that the commissions are paid out to you, using the USD value calculated at Clause
          3.3(a) , we will calculate your commissions in CAKE tokens using the prevailing USD price of CAKE tokens at
          that time.
        </Text>
        <Text as="p">3.4 In calculating your commissions, we reserve the right to determine the:</Text>
        <Text as="p">
          (a) prevailing USD price of the Trading Fees Denomination and the CAKE tokens by reference to the spot price
          on a centralised exchange, the exchange rate in a liquidity pool, or a data oracle in our sole discretion; and
        </Text>
        <Text as="p">(b) exact timing which the prevailing price is taken at.</Text>
        <Text as="p">
          3.5 Our system will generate a report of the commissions that you have earnt on a dashboard which we will
          provide you access with. In the absence of manifest error, the report shall serve as conclusive evidence of
          the commissions that you have earnt (subject to this Agreement).
        </Text>
        <Text as="p">
          3.6 You may request to redeem your commissions once a month, subject to changes made in our sole discretion,
          with notice to you. (e.g., We may decide to allow you to redeem commissions earlier than once a month, or in
          cases of technical difficulties, we may delay your redemption request and release commissions beyond a one
          month period.)
        </Text>
        <Text as="p">
          3.7 Redemptions are done on a monthly basis, subject to changes made in our sole discretion, with notice to
          you – i.e., you may only request to redeem commissions earnt in the previous calendar month (or for an earlier
          time period).
        </Text>
        <Text as="p">
          3.8 You shall be responsible for paying all taxes, charges, levies, assessments and other fees of any kind
          imposed on your involvement in this Agreement.
        </Text>
        <Text as="p">
          3.9 If we are required by applicable laws to withhold taxes on any payments due to you, or to account for any
          sales tax / VAT / GST on payments due to you, we reserve the right to do so.
        </Text>
        <Text as="p">
          3.10 For the avoidance of doubt, commissions are accrued only when the following conditions are met:
        </Text>
        <Text as="p">(a) The Referral signs up using your unique referral link;</Text>
        <Text as="p">(b) The Referral pays the trading fees; and</Text>
        <Text as="p">(c) We receive the trading fees.</Text>
        <Text as="p">
          3.11 For avoidance of doubt, in the event of termination of this Agreement, you will not be eligible for any
          further commissions (i.e., commissions will cease to accrue), from the date of termination of this Agreement.
        </Text>

        <Text as="h3">4. Forfeiture of Commissions and suspension</Text>
        <Text as="p">
          If in our reasonable view, you breach any term of this Agreement (especially Clause 16 (Prohibited
          Activities)), with respect to commissions that accrued after the time of the breach, we reserve the right to
          (without prejudice to any other remedies that may be available to us in law):
        </Text>
        <Text as="p">
          (a) forfeit all your commissions (that have not yet been paid) and claim against you to recover any commission
          (that are already paid); and/or
        </Text>
        <Text as="p">
          (b) decline your registration for the Program, suspend your related accounts, and any other administrative
          measures to cease your involvement with the Program.
        </Text>

        <Text as="h3">5. Unilateral variation and changes</Text>
        <Text as="p">
          5.1 Provided that we do not prejudice any commissions already accrued by you, we reserve the right to
          unilaterally vary upon notice to you at any time, the following:
        </Text>
        <Text as="p">(a) commission rates, terms and eligibility of the commissions; and/or</Text>
        <Text as="p">(b) rules of the Affiliate Program.</Text>
        <Text as="p">
          5.2 Without limiting the scope of our discretion in Clause 5.1 , we may elect to revise the commission rates,
          terms and eligibility of the commissions on a monthly basis considering circumstances including but not
          limited to:
        </Text>
        <Text as="p">(a) Change in business environment;</Text>
        <Text as="p">(b) unexpected trading volumes or activity by the Referrals; and/or</Text>
        <Text as="p">(c) unsuitable trading profile of the Referrals.</Text>
        <Text as="p">
          5.3 An electronic message by us to any of the means of communication (i.e., email address, telegram) provided
          by you shall constitute valid notice.
        </Text>
        <Text as="p">
          5.4 We reserve the right to make changes to, vary, or even discontinue, the services to the Referrals (and/or
          to you) at our discretion, at any time (e.g., the swap services). For the avoidance of doubt, the trading fees
          charged on the services, or any platforms or providers used in the course of providing the services may be
          changed or varied.
        </Text>

        <Text as="h3">6. Sharing your Commissions with your Referrals</Text>
        <Text as="p">
          6.1 With respect to commissions received under Clause 2 (Commissions for swap trades), you may choose to offer
          a share of your commissions to your Referrals, using the system provided by us. The Referral may receive up to
          a maximum of <strong>100</strong>% of the commissions that you have earnt from them.
        </Text>
        <Text as="p">
          6.2 You may not privately share (or make any arrangements to share) your commissions with your Referrals. Any
          sharing of commissions must be done through the system provided by us.
        </Text>
        <Text as="p">
          6.3 For avoidance of doubt, in the event of termination of this Agreement, the Referral will not be eligible
          for any further commissions (i.e., commissions will cease to accrue), from the date of termination of this
          Agreement.
        </Text>

        <Text as="h3">7. Performance</Text>
        <Text as="p">
          7.1 Once you have signed up for the Program, you will be provided with a URL affiliate link that must be used
          to identify you when placing a link from your social media channels. It is your responsibility to ensure each
          such link is correctly formatted.
        </Text>
        <Text as="p">7.2 You will be solely responsible for, and incur costs at your own expense for:</Text>
        <Text as="p">
          (a) the development, operation, and maintenance of your social media channels and for all materials that
          appear on your social media channel; and
        </Text>
        <Text as="p">
          (b) ensuring that your reviews, product descriptions and articles (if applicable at your social media) obey
          all applicable copyright, trademark, and other laws.
        </Text>
        <Text as="p">
          7.3 Any statements you make about PancakeSwap must reflect your honest opinions, beliefs, or experiences and
          must not be false, misleading, or unsupported.
        </Text>
        <Text as="p">7.4 There is no limit on the number of Referrals that you may invite.</Text>

        <Text as="h3">8. Registration</Text>
        <Text as="p">
          You agree to provide and maintain accurate, complete, and up-to-date information when registering for the
          Program.
        </Text>

        <Text as="h3">9. Affiliate’s Warranties</Text>
        <Text as="p">You warrant, represent, and undertake to PancakeSwap that:</Text>
        <Text as="p">(a) If you are contracting in your personal capacity, you are at least 18 years of age;</Text>
        <Text as="p">
          (b) You do not have any unspent criminal convictions of any kind, subsisting at the Effective Date of the
          Agreement;
        </Text>
        <Text as="p">
          (c) You are acting independently and understand the risks involved in promoting digital assets across various
          regions worldwide;
        </Text>
        <Text as="p">
          (d) You shall provide and maintain accurate, complete, and up-to-date information when registering for the
          Program; and
        </Text>
        <Text as="p">
          (e) Any blockchain address or payment account provided by you to receive payments are owned solely by you.
        </Text>

        <Text as="h3">10. Prohibited Jurisdictions</Text>
        <Text as="p">10.1 You may not participate in the Program if:</Text>
        <Text as="p">
          (a) there are regulatory and/or legal prohibitions imposed on cryptocurrencies (or the marketing of
          cryptocurrencies) in your country of residence;
        </Text>
        <Text as="p">
          (b) you are a resident or citizen in any of the prohibited jurisdictions set out in the Annex (“
          <strong>Prohibited Jurisdictions</strong>”); and/or
        </Text>
        <Text as="p">
          (c) the intended or targeted audience (or significant portion thereof) of your marketing are residents or
          citizens in any of the Prohibited Jurisdictions.
        </Text>

        <Text as="h3">11. Relationship of the Parties</Text>
        <Text as="p">
          You agree that this Agreement creates the relationship of service recipient and independent contractor, and
          not that of employer and employee. You will not be treated as an employee of PancakeSwap for any purpose.
          Nothing in this Agreement will create any, partnership, joint venture, agency, franchise, sales representative
          or employer-employee relationships between the Parties. You shall have no authority to make or accept any
          offers or representations on behalf of PancakeSwap. You shall have no authority to bind PancakeSwap, and
          undertake not to hold yourself out as an employee, agent or authorised representative of PancakeSwap.
        </Text>

        <Text as="h3">12. No Joint Publicity</Text>
        <Text as="p">
          You may not claim that any materials are created jointly between you and PancakeSwap, or attribute any
          materials created or issued by you (including press releases) to PancakeSwap.
        </Text>

        <Text as="h3">13. Term and Termination</Text>
        <Text as="p">
          13.1 PancakeSwap reserves the right to terminate this Agreement in its entirety with or without cause,
          effective immediately with written notice of termination to you (for the avoidance of doubt, an email to the
          email address provided by you shall constitute written notice). Upon the termination of this Agreement for any
          reason, you shall immediately cease use of (and remove from your site) all links to the PancakeSwap website
          and all images of PancakeSwap and other materials provided under the Program.
        </Text>
        <Text as="p">
          13.2 PancakeSwap, in its sole discretion, reserves the right to suspend or terminate your account and refuse
          any and all current or future use of the Program, or any other PancakeSwap service, for any reason and at any
          time. Such termination will result in the deactivation or deletion of your Affiliate Account.
        </Text>
        <Text as="p">13.3 PancakeSwap reserves the right to refuse service to anyone for any reason at any time.</Text>

        <Text as="h3">14. Indemnification</Text>
        <Text as="p">
          You shall indemnify PancakeSwap from and against all claims, losses, liabilities, damages, administrative
          fines, costs and expenses (including reasonable attorney’s fees) with respect to any third-party claim arising
          out of your breach of this Agreement.
        </Text>

        <Text as="h3">15. Limits of Liability</Text>
        <Text as="p">
          PancakeSwap and any of PancakeSwap&apos;s officers, directors, employees, shareholders or agents of any of
          them, exclude all liability and responsibility for any amount or kind of loss or damage that may result to you
          or a third party (including without limitation, any direct, indirect, punitive or consequential loss or
          damages, or any loss of income, profits, goodwill, data, contracts, use of money, or loss or damages arising
          from or connected in any way to business interruption, and whether in tort (including without limitation
          negligence), contract or otherwise) in connection with this Agreement.
        </Text>

        <Text as="h3">16. Prohibited Activities</Text>
        <Text as="p">You shall not engage in the following activities:</Text>
        <Text as="p">(a) creating and/or publishing content that is:</Text>
        <Text as="p">
          (i) unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libellous,
          invasive of another’s privacy, hateful (racially, ethnically, or otherwise), and/or prejudicial in any form;
        </Text>
        <Text as="p">
          (ii) likely to breach any contract or law or breach any duty of confidentiality, infringe any copyright or
          data protection rights, or constitute contempt of court;
        </Text>
        <Text as="p">(iii) misleading, misrepresentative, fraudulent or false;</Text>
        <Text as="p">(iv) constitute overly aggressive, questionable sales or marketing methods;</Text>
        <Text as="p">
          (b) making any representations or providing advice, in the course of your performance regarding investments,
          investment outcomes, the likelihood of returns, or suitability for investment. For example, you should not
          make any price predictions over the CAKE tokens;
        </Text>
        <Text as="p">
          (c) using the Program for any illegal or unauthorised purpose or in a way which violate any laws in your
          jurisdiction (including but not limited to copyright laws); and/or
        </Text>
        <Text as="p">
          (d)self-referring yourself (or accounts/entities controlled, influenced, or directed by you) using your own
          referral link; and/or
        </Text>
        <Text as="p">
          (e) directing or causing existing users or previous users of PancakeSwap Services to create new addresses to
          sign up with your referral link
        </Text>
        <Text as="p">
          (f) Conduct marketing or make any representations of any PancakeSwap products and services to users in the
          Prohibited Jurisdictions listed in the Annex;
        </Text>
        <Text as="p">
          (g) Conduct marketing or make any representations to any user in the United States, in relation to any of the
          following products or services:
        </Text>
        <Text as="p">(i) Any perpetual product or service;</Text>
        <Text as="p">
          (ii) Initial Farm Offering (“<strong>IFO</strong>”) of any project;
        </Text>
        <Text as="p">(iii) Any Farms, Pools, Lottery, Pottery, NFT product or service.</Text>

        <Text as="h3">17. Marks</Text>
        <Text as="p">
          PancakeSwap may provide you with trademarks and/or graphical images that can be used to promote PancakeSwap.
          You may not modify these trademarks and/or images in any way. PancakeSwap reserves the right to change the
          trademarks and/or images at any time without notice.
        </Text>

        <Text as="h3">18. Disclosure of Affiliate relationship</Text>
        <Text as="p">
          You must include a clear and concise statement to any third parties that you market to that discloses your
          relationship as an Affiliate which is promoting PancakeSwap. For example:
        </Text>
        <Text as="p">
          (a) If you promote PancakeSwap through a web page, podcast, blog post, or social media post as an endorsement
          or review of PancakeSwap or incentivise others to do so, you must ensure that such post includes a clear
          disclosure that it is an advertisement or was otherwise promoted by PancakeSwap; and
        </Text>
        <Text as="p">
          (b) Your disclosure must be as close as possible to the review or endorsement, be placed above the fold so it
          does not require any scrolling to see it, and not be in the form of a pop-up.
        </Text>

        <Text as="h3">19. Rights of third parties</Text>
        <Text as="p">
          A person who is not a party to this Agreement shall not have any rights whatsoever under this Agreement or to
          enforce this Agreement. For the avoidance of doubt, a Referral, even one that receives a share of commissions
          under Clause 7 (Sharing your Commissions with your Referrals) is not a party to this Agreement.
        </Text>

        <Text as="h3">20. Governing law and dispute resolution</Text>
        <Text as="p">
          20.1 This Agreement and any dispute or claim (including non-contractual disputes or claims) arising out of or
          in connection with it or its subject matter or formation shall be governed by and construed in accordance with
          the laws of the Republic of Singapore.
        </Text>
        <Text as="p">
          20.2 Any dispute arising out of or in connection with this contract, including any question regarding its
          existence, validity or termination, shall be referred to and finally resolved by arbitration administered by
          the Singapore International Arbitration Centre (“<strong>SIAC</strong>”) in accordance with the Arbitration
          Rules of the Singapore International Arbitration Centre (“<strong>SIAC Rules</strong>”) for the time being in
          force, which rules are deemed to be incorporated by reference in this clause. The seat of the arbitration
          shall be Singapore. The Tribunal shall consist of a sole arbitrator. The language of the arbitration shall be
          English.
        </Text>
        <Text as="p">
          20.3 In respect of any court proceedings in Singapore commenced under the International Arbitration Act 1994
          in relation to the arbitration, the parties agree (a) to commence such proceedings before the Singapore
          International Commercial Court (“<strong>the SICC</strong>”); and (b) in any event, that such proceedings
          shall be heard and adjudicated by the SICC.
        </Text>

        <Text as="h3">Annex: Prohibited Jurisdictions</Text>
        <Text as="p">
          Afghanistan, Albania, Algeria, Andorra, Angola, Anguilla, Armenia, Aruba, Azerbaijan, Bangladesh, Belize,
          Benin, Bhutan, Bolivia, Bosnia & Herzegovina, Botswana, Brunei, Burkina, Faso Burma (Myanmar), Burundi,
          Cambodia, Cameroon, Cape Verde (Cabo Verde), Central Africa Republic, Chad, China, Comoros Congo, Dem. Rep.
          Congo, Repub. of the Cook Islands, Cote d&apos;Ivoire, Cuba, Djibouti, Dominica, East Timor (Timor-Leste),
          Ecuador, Equatorial Guinea, Eritrea, Ethiopia, Gabon, Gambia, the Gaza Strip, Georgia, Ghana, Grenada, Guinea,
          Guinea-Bissau, Guyana, Haiti, Iran, Iraq, Jamaica, Kazakhstan, Kiribati, North Korea, North Kosovo, Kyrgyzstan
          (Kyrgyz Republic), Laos, Lebanon, Lesotho, Liberia, Libya, Macau, Madagascar, Malawi, Maldives, Mali, Marshall
          Islands, Mauritania, Mauritius, Mayotte, Micronesia, Fed. St., Moldova, Mongolia, Montenegro, Montserrat,
          Morocco, Mozambique, Namibia, Nauru, Nepal, New York, Nicaragua, Niger, Pakistan, Palau, Palestine, Panama,
          Papua New Guinea, Russia, Rwanda, Saint Helena, Samoa, Sao Tome & Principe, Senegal, Sierra Leone, Singapore,
          Solomon Islands, Somalia, Sudan, Suriname, Swaziland, Syria, Tajikistan, Tanzania, Togo, Tonga, Turkmenistan,
          Tuvalu, Ukraine, Uganda, Uzbekistan, Vanuatu, Venezuela, Wallis and Futuna, West Bank, Western Sahara, Yemen,
          Zambia, Zimbabwe (or any additional country or jurisdiction added to this list by PancakeSwap from time to
          time, in its sole discretion, with notice to you).
        </Text>
      </Container>
    </AffiliatesProgramLayout>
  )
}

UsAgreement.chains = []

export default UsAgreement
