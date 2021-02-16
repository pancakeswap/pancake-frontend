import { Campaign } from './types'

/**
 * id: The campaign id (required)
 * type: The type of the achievement
 * title: A string or an object to be translated.
 * Note: If string it could be used as a variable in a translation e.g. IFOs
 *
 * badge: Achievement avatar
 */

const campaigns: Campaign[] = [
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
