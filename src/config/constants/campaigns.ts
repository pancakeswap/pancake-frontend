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
    badge: 'ifo-blk.svg',
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
