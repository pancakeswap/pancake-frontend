import { Campaign } from './types'

/**
 * id: The campaign id (required)
 * type: The type of the achievement
 * title: A string or an object to be translated.
 * Note: If the value is a string it is likely used as data in a translation object
 *
 * badge: Achievement avatar
 */

const campaigns: Campaign[] = [
  {
    id: '511110000',
    type: 'ifo',
    title: 'Kalmar',
    badge: 'ifo-kalm.svg',
  },
  {
    id: '511100000',
    type: 'ifo',
    title: 'Hotcross',
    badge: 'ifo-hotcross.svg',
  },
  {
    id: '511090000',
    type: 'ifo',
    title: 'Horizon Protocol',
    badge: 'ifo-hzn.svg',
  },
  {
    id: '511080000',
    type: 'ifo',
    title: 'Belt',
    badge: 'ifo-belt.svg',
  },
  {
    id: '511070000',
    type: 'ifo',
    title: 'Yieldwatch',
    badge: 'ifo-watch.svg',
  },
  {
    id: '511060000',
    type: 'ifo',
    title: 'Berry',
    badge: 'ifo-bry.svg',
  },
  {
    id: '511050000',
    type: 'ifo',
    title: 'Soteria',
    badge: 'ifo-wsote.svg',
  },
  {
    id: '511040000',
    type: 'ifo',
    title: 'Helmet',
    badge: 'ifo-helmet.svg',
  },
  {
    id: '511030000',
    type: 'ifo',
    title: 'Tenet',
    badge: 'ifo-ten.svg',
  },
  {
    id: '511020000',
    type: 'ifo',
    title: 'Ditto',
    badge: 'ifo-ditto.svg',
  },
  {
    id: '511010000',
    type: 'ifo',
    title: 'Blink',
    badge: 'ifo-blink.svg',
  },
  {
    id: '512010001',
    type: 'teambattle',
    title: 'Easter Champion: Gold',
    badge: 'easter-champion-gold.svg',
  },
  {
    id: '512010002',
    type: 'teambattle',
    title: 'Easter Top 500: Gold',
    badge: 'easter-top-500-gold.svg',
  },
  {
    id: '512010003',
    type: 'teambattle',
    title: 'Easter Top 500: Gold',
    badge: 'easter-top-500-gold.svg',
  },
  {
    id: '512010004',
    type: 'teambattle',
    title: 'Easter Top 500: Gold',
    badge: 'easter-top-500-gold.svg',
  },
  {
    id: '512010005',
    type: 'teambattle',
    title: 'Easter Participant: Gold',
    badge: 'easter-participant-gold.svg',
  },
  {
    id: '512010006',
    type: 'teambattle',
    title: 'Easter Champion: Silver',
    badge: 'easter-champion-silver.svg',
  },
  {
    id: '512010007',
    type: 'teambattle',
    title: 'Easter Top 500: Silver',
    badge: 'easter-top-500-silver.svg',
  },
  {
    id: '512010008',
    type: 'teambattle',
    title: 'Easter Top 500: Silver',
    badge: 'easter-top-500-silver.svg',
  },
  {
    id: '512010009',
    type: 'teambattle',
    title: 'Easter Top 500: Silver',
    badge: 'easter-top-500-silver.svg',
  },
  {
    id: '512010010',
    type: 'teambattle',
    title: 'Easter Participant: Silver',
    badge: 'easter-participant-silver.svg',
  },
  {
    id: '512010011',
    type: 'teambattle',
    title: 'Easter Champion: Bronze',
    badge: 'easter-champion-bronze.svg',
  },
  {
    id: '512010012',
    type: 'teambattle',
    title: 'Easter Top 500: Bronze',
    badge: 'easter-top-500-bronze.svg',
  },
  {
    id: '512010013',
    type: 'teambattle',
    title: 'Easter Top 500: Bronze',
    badge: 'easter-top-500-bronze.svg',
  },
  {
    id: '512010014',
    type: 'teambattle',
    title: 'Easter Top 500: Bronze',
    badge: 'easter-top-500-bronze.svg',
  },
  {
    id: '512010015',
    type: 'teambattle',
    title: 'Easter Participant: Bronze',
    badge: 'easter-participant-bronze.svg',
  },
  {
    id: '513010001',
    type: 'participation',
    title: 'Syrup Soaker',
    description: 'Took a dip in the early days of the Auto CAKE Pool',
    badge: 'syrup-soaker.svg',
  },
  {
    id: '514010001',
    type: 'participation',
    title: 'Clairvoyant',
    description: 'Played a round of Prediction before round 12,120',
    badge: 'clairvoyant.svg',
  },
  {
    id: '515010001',
    type: 'participation',
    title: 'Lottie',
    description: 'Joined a round in the early days of Lottery V2',
    badge: 'lottie.svg',
  },
  {
    id: '515020001',
    type: 'participation',
    title: 'Lucky',
    description: 'Won a round in the early days of Lottery V2',
    badge: 'lucky.svg',
  },
  {
    id: '515030001',
    type: 'participation',
    title: 'Baller',
    description: 'Top 100 ticket buyer in the early days of Lottery V2',
    badge: 'baller.svg',
  },
  {
    id: '516010001',
    type: 'participation',
    title: '1 Year',
    description: 'Joined PancakeSwap during the first year of our journey!',
    badge: '1-year.svg',
  },
  {
    id: '511120000',
    type: 'ifo',
    title: 'Duelist King',
    badge: 'ifo-dkt.svg',
  },
  {
    id: '511130000',
    type: 'ifo',
    title: 'Mines of Dalarnia',
    badge: 'ifo-dar.svg',
  },
  {
    id: '511140000',
    type: 'ifo',
    title: 'FC Porto Fan Token',
    badge: 'ifo-porto.svg',
  },
  {
    id: '511150000',
    type: 'ifo',
    title: 'FC Santos Fan Token',
    badge: 'ifo-santos.svg',
  },
  {
    id: '512020001',
    type: 'teambattle',
    title: 'Fan Token Champion: Gold',
    badge: 'fan-token-champion-gold.svg',
  },
  {
    id: '512020002',
    type: 'teambattle',
    title: 'Fan Token Top 10: Gold',
    badge: 'fan-token-top-10-gold.svg',
  },
  {
    id: '512020003',
    type: 'teambattle',
    title: 'Fan Token Top 100: Gold',
    badge: 'fan-token-top-100-gold.svg',
  },
  {
    id: '512020004',
    type: 'teambattle',
    title: 'Fan Token Top 500: Gold',
    badge: 'fan-token-top-500-gold.svg',
  },
  {
    id: '512020005',
    type: 'teambattle',
    title: 'Fan Token Participant: Gold',
    badge: 'fan-token-participant-gold.svg',
  },
  {
    id: '512020006',
    type: 'teambattle',
    title: 'Fan Token Champion: Silver',
    badge: 'fan-token-champion-silver.svg',
  },
  {
    id: '512020007',
    type: 'teambattle',
    title: 'Fan Token Top 10: Silver',
    badge: 'fan-token-top-10-silver.svg',
  },
  {
    id: '512020008',
    type: 'teambattle',
    title: 'Fan Token Top 100: Silver',
    badge: 'fan-token-top-100-silver.svg',
  },
  {
    id: '512020009',
    type: 'teambattle',
    title: 'Fan Token Top 500: Silver',
    badge: 'fan-token-top-500-silver.svg',
  },
  {
    id: '512020010',
    type: 'teambattle',
    title: 'Fan Token Participant: Silver',
    badge: 'fan-token-participant-silver.svg',
  },
  {
    id: '512020011',
    type: 'teambattle',
    title: 'Fan Token Champion: Bronze',
    badge: 'fan-token-champion-bronze.svg',
  },
  {
    id: '512020012',
    type: 'teambattle',
    title: 'Fan Token Top 10: Bronze',
    badge: 'fan-token-top-10-bronze.svg',
  },
  {
    id: '512020013',
    type: 'teambattle',
    title: 'Fan Token Top 100: Bronze',
    badge: 'fan-token-top-100-bronze.svg',
  },
  {
    id: '512020014',
    type: 'teambattle',
    title: 'Fan Token Top 500: Bronze',
    badge: 'fan-token-top-500-bronze.svg',
  },
  {
    id: '512020015',
    type: 'teambattle',
    title: 'Fan Token Participant: Bronze',
    badge: 'fan-token-participant-bronze.svg',
  },
  {
    id: '511160000',
    type: 'ifo',
    title: 'Diviner Protocol',
    badge: 'ifo-dpt.svg',
  },
  {
    id: '511170000',
    type: 'ifo',
    title: 'Froyo Games',
    badge: 'ifo-froyo.svg',
  },
  {
    id: '511180000',
    type: 'ifo',
    title: 'Era7',
    badge: 'ifo-era.svg',
  },
  {
    id: '511190000',
    type: 'ifo',
    title: 'Duet',
    badge: 'ifo-duet.svg',
  },
  {
    id: '511200000',
    type: 'ifo',
    title: 'Trivia',
    badge: 'ifo-trivia.svg',
  },
  {
    id: '511300000',
    type: 'ifo',
    title: 'Peel',
    badge: 'ifo-peel.svg',
  },
  {
    id: '511400000',
    type: 'ifo',
    title: 'Wom',
    badge: 'ifo-wom.svg',
  },
  {
    id: '511500000',
    type: 'ifo',
    title: 'Hoop',
    badge: 'ifo-hoop.svg',
  },
  {
    id: '512030001',
    type: 'teambattle',
    title: 'Mobox Champion: Gold',
    badge: 'MBOX-champion-gold.svg',
  },
  {
    id: '512030002',
    type: 'teambattle',
    title: 'Mobox Top 10: Gold',
    badge: 'MBOX-top-10-gold.svg',
  },
  {
    id: '512030003',
    type: 'teambattle',
    title: 'Mobox Top 100: Gold',
    badge: 'MBOX-top-100-gold.svg',
  },
  {
    id: '512030004',
    type: 'teambattle',
    title: 'Mobox Top 500: Gold',
    badge: 'MBOX-top-500-gold.svg',
  },
  {
    id: '512030005',
    type: 'teambattle',
    title: 'Mobox Participant: Gold',
    badge: 'MBOX-participant-gold.svg',
  },
  {
    id: '512030006',
    type: 'teambattle',
    title: 'Mobox Champion: Silver',
    badge: 'MBOX-champion-silver.svg',
  },
  {
    id: '512030007',
    type: 'teambattle',
    title: 'Mobox Top 10: Silver',
    badge: 'MBOX-top-10-silver.svg',
  },
  {
    id: '512030008',
    type: 'teambattle',
    title: 'Mobox Top 100: Silver',
    badge: 'MBOX-top-100-silver.svg',
  },
  {
    id: '512030009',
    type: 'teambattle',
    title: 'Mobox Top 500: Silver',
    badge: 'MBOX-top-500-silver.svg',
  },
  {
    id: '512030010',
    type: 'teambattle',
    title: 'Mobox Participant: Silver',
    badge: 'MBOX-participant-silver.svg',
  },
  {
    id: '512030011',
    type: 'teambattle',
    title: 'Mobox Champion: Bronze',
    badge: 'MBOX-champion-bronze.svg',
  },
  {
    id: '512030012',
    type: 'teambattle',
    title: 'Mobox Top 10: Bronze',
    badge: 'MBOX-top-10-bronze.svg',
  },
  {
    id: '512030013',
    type: 'teambattle',
    title: 'Mobox Top 100: Bronze',
    badge: 'MBOX-top-100-bronze.svg',
  },
  {
    id: '512030014',
    type: 'teambattle',
    title: 'Mobox Top 500: Bronze',
    badge: 'MBOX-top-500-bronze.svg',
  },
  {
    id: '512030015',
    type: 'teambattle',
    title: 'Mobox Participant: Bronze',
    badge: 'MBOX-participant-bronze.svg',
  },
  {
    id: '512040001',
    type: 'teambattle',
    title: 'MoD Champion: Gold',
    badge: 'MoD-champion-gold.svg',
  },
  {
    id: '512040002',
    type: 'teambattle',
    title: 'MoD Top 10: Gold',
    badge: 'MoD-top-10-gold.svg',
  },
  {
    id: '512040003',
    type: 'teambattle',
    title: 'MoD Top 100: Gold',
    badge: 'MoD-top-100-gold.svg',
  },
  {
    id: '512040004',
    type: 'teambattle',
    title: 'MoD Top 500: Gold',
    badge: 'MoD-top-500-gold.svg',
  },
  {
    id: '512040005',
    type: 'teambattle',
    title: 'MoD Participant: Gold',
    badge: 'MoD-participant-gold.svg',
  },
  {
    id: '512040006',
    type: 'teambattle',
    title: 'MoD Champion: Silver',
    badge: 'MoD-champion-silver.svg',
  },
  {
    id: '512040007',
    type: 'teambattle',
    title: 'MoD Top 10: Silver',
    badge: 'MoD-top-10-silver.svg',
  },
  {
    id: '512040008',
    type: 'teambattle',
    title: 'MoD Top 100: Silver',
    badge: 'MoD-top-100-silver.svg',
  },
  {
    id: '512040009',
    type: 'teambattle',
    title: 'MoD Top 500: Silver',
    badge: 'MoD-top-500-silver.svg',
  },
  {
    id: '512040010',
    type: 'teambattle',
    title: 'MoD Participant: Silver',
    badge: 'MoD-participant-silver.svg',
  },
  {
    id: '512040011',
    type: 'teambattle',
    title: 'MoD Champion: Bronze',
    badge: 'MoD-champion-bronze.svg',
  },
  {
    id: '512040012',
    type: 'teambattle',
    title: 'MoD Top 10: Bronze',
    badge: 'MoD-top-10-bronze.svg',
  },
  {
    id: '512040013',
    type: 'teambattle',
    title: 'MoD Top 100: Bronze',
    badge: 'MoD-top-100-bronze.svg',
  },
  {
    id: '512040014',
    type: 'teambattle',
    title: 'MoD Top 500: Bronze',
    badge: 'MoD-top-500-bronze.svg',
  },
  {
    id: '512040015',
    type: 'teambattle',
    title: 'MoD Participant: Bronze',
    badge: 'MoD-participant-bronze.svg',
  },
]

/**
 * Transform the campaign config into a map. Keeps the config the same
 * as the others and allows easy access to a campaign by id
 */
export const campaignMap = new Map<string, Campaign>()

campaigns.forEach((campaign) => {
  campaignMap.set(campaign.id, campaign)
})

export default campaigns
