import React from 'react'
import { Button } from '@pancakeswap/uikit'
import { SaleStatusEnum, UserStatusEnum } from 'views/PancakeSquad/types'
import ActivateProfileButton from '../Buttons/ActivateProfile'
import BuyTicketsButtons from '../Buttons/BuyTickets'
import EndEventButtons from '../Buttons/EndEvent'
import MintButton from '../Buttons/Mint'
import ReadyText from '../Header/ReadyText'
import { EventStepsType } from './types'
import { getStepperStatus } from './utils'

const stepsConfigBuilder = ({ t, userInfos, eventInfos, userStatus, account, theme, cakeBalance }: EventStepsType) => {
  const { maxPerAddress, maxPerTransaction, maxSupply, pricePerTicket } = eventInfos || {}
  const {
    canClaimForGen0,
    ticketsOfUser,
    numberTicketsUsedForGen0,
    numberTicketsOfUser,
    numberTicketsForGen0,
    numberTokensOfUser,
  } = userInfos || {}

  const { saleStatus, totalTicketsDistributed, totalSupplyMinted, startTimestamp } = eventInfos || {}

  const hasProfileActivated = [UserStatusEnum.PROFILE_ACTIVE, UserStatusEnum.PROFILE_ACTIVE_GEN0].includes(userStatus)
  const isBuyPhaseFinished = totalTicketsDistributed === maxSupply
  const isMintingFinished = totalSupplyMinted === maxSupply
  const hasData = !!eventInfos && !!userInfos

  return [
    {
      id: 1,
      status: getStepperStatus({
        saleStatus,
        hasProfileActivated,
        eventStatus: [SaleStatusEnum.Pending, SaleStatusEnum.Premint],
      }),
      title: t('Activate your profile'),
      bodyText: [t('You’ll need an active PancakeSwap Profile to buy Minting Tickets and mint a Pancake Squad NFT!')],
      buttons: (
        <>
          <ActivateProfileButton userStatus={userStatus} t={t} />
          {hasProfileActivated && <ReadyText text={t("You're all set!")} />}
        </>
      ),
    },
    {
      id: 2,
      status: getStepperStatus({
        saleStatus,
        hasProfileActivated,
        eventStatus: [SaleStatusEnum.Pending, SaleStatusEnum.Premint],
      }),
      title: t('Hold CAKE'),
      bodyText: [t('Each NFT costs CAKE to mint. Remember you also need BNB to cover transaction fees too!')],
      buttons: (
        <>
          <Button
            as="a"
            href="https://pancakeswap.finance/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"
            target="_blank"
            width="100%"
          >
            {t('Buy CAKE')}
          </Button>
        </>
      ),
    },
    {
      id: 3,
      status: getStepperStatus({
        saleStatus,
        hasProfileActivated,
        eventStatus: [SaleStatusEnum.Presale, SaleStatusEnum.Sale],
      }),
      title: t('Buy Squad Tickets'),
      bodyText: [
        t('Buy Squad Tickets, while stocks last. You’ll use them in step 4.'),
        t(
          'Pre-sale: Wallets which held “Gen 0” Pancake Bunnies NFTs (bunnyID 0,1,2,3,4) at a snapshot shortly before the presale phase begins can purchase one Squad Ticket per Gen 0 NFT.',
        ),
        t(
          'Public Sale: Any wallet with an active Pancake Profile can purchase up to 10 Squad Tickets, while stocks last.',
        ),
      ],
      buttons: (
        <>
          {hasData && (
            <BuyTicketsButtons
              t={t}
              account={account}
              theme={theme}
              userStatus={userStatus}
              saleStatus={saleStatus}
              canClaimForGen0={canClaimForGen0}
              maxPerAddress={maxPerAddress}
              numberTicketsOfUser={numberTicketsOfUser}
              numberTicketsUsedForGen0={numberTicketsUsedForGen0}
              cakeBalance={cakeBalance}
              maxPerTransaction={maxPerTransaction}
              numberTicketsForGen0={numberTicketsForGen0}
              pricePerTicket={pricePerTicket}
              startTimestamp={startTimestamp}
            />
          )}
          {isBuyPhaseFinished && hasData && <ReadyText mt="16px" text={t('Phase Complete!')} />}
        </>
      ),
    },
    {
      id: 4,
      status: getStepperStatus({
        saleStatus,
        hasProfileActivated,
        eventStatus: [SaleStatusEnum.Claim],
        numberTicketsOfUser,
      }),
      title: t('Claim Phase'),
      bodyText: [
        t('During this phase, any wallet holding a Squad Ticket can redeem their ticket to claim a Pancake Squad NFT.'),
      ],
      buttons: (
        <>
          {hasData && (
            <MintButton
              t={t}
              theme={theme}
              saleStatus={saleStatus}
              numberTicketsOfUser={numberTicketsOfUser}
              numberTokensOfUser={numberTokensOfUser}
              ticketsOfUser={ticketsOfUser}
            />
          )}
          {isMintingFinished && hasData && <ReadyText mt="16px" text={t('Phase Complete!')} />}
        </>
      ),
    },
    {
      id: 5,
      status: getStepperStatus({
        saleStatus,
        hasProfileActivated,
        eventStatus: [SaleStatusEnum.Claim],
        isLastPhase: true,
      }),
      title: t('Wait for the Reveal'),
      bodyText: [
        t('It’ll take a few days before your bunny’s image is revealed. Just hold tight and wait for the final image!'),
        t('Trading will open before the images are live, but you’ll still be able to check the bunnies’ stats.'),
      ],
      buttons: (
        <>
          {hasData && (
            <EndEventButtons
              t={t}
              saleStatus={saleStatus}
              userStatus={userStatus}
              maxSupply={maxSupply}
              totalSupplyMinted={totalSupplyMinted}
              numberTokensOfUser={numberTokensOfUser}
              account={account}
            />
          )}
        </>
      ),
    },
  ]
}

export default stepsConfigBuilder
