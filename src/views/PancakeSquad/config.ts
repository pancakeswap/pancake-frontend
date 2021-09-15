import { ContextApi } from 'contexts/Localization/types'
import { DynamicSaleInfos, FixedSaleInfos } from './components/Header/types'
import { SaleStatusEnum } from './types'

type nftSaleType = {
  t: ContextApi['t']
} & FixedSaleInfos &
  DynamicSaleInfos

const getReadyStatusMapping: Record<SaleStatusEnum, string> = {
  [SaleStatusEnum.Pending]: '',
  [SaleStatusEnum.Presale]: '',
  [SaleStatusEnum.Sale]: '',
  [SaleStatusEnum.Claim]: '',
  [SaleStatusEnum.Premint]: '',
  [SaleStatusEnum.DrawingRandomness]: '',
}

const nftSaleConfigBuilder: ({
  t,
  saleStatus,
  canClaimForGen0,
  maxPerAddress,
  maxSupply,
  pricePerTicket,
  startTimestamp,
  totalTicketsDistributed,
}: nftSaleType) => any[] = (t) => [
  {
    status: 'past',
    text: 'Get Ready',
    infoText: 'Activate your profile and make sure you have at least 5 BNB in your wallet to buy a Minting Ticket.',
  },
  {
    status: 'live',
    text: 'Pre-Sale: Now Live',
    infoText:
      'During this phase, any wallet holding a Minting Ticket can redeem their ticket to mint a Pancake Squad NFT.',
  },
  {
    status: 'upcoming',
    text: 'Public-Sale:',
    altText: '1d 4h 34m',
    infoText:
      'Public Sale: Any wallet with an active Pancake Profile can purchase up to 20 Minting Tickets, while stocks last.',
  },
  {
    status: 'upcoming',
    text: 'Mint',
    infoText:
      'Pre-sale: Wallets which held “Gen 0” Pancake Bunnies NFTs (bunnyID 0,1,2,3,4) at block xxxxxxx can purchase one Minting Ticket per Gen 0 NFT.',
  },
]

export default nftSaleConfigBuilder
