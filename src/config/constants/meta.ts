import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'RugZombie',
  description:
    'Bringing your rugged tokens back from the dead.',
  image: 'https://storage.googleapis.com/rug-zombie/6.png',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Home | RugZombie',
  },
  '/competition': {
    title: 'Trading Battle | RugZombie',
  },
  '/prediction': {
    title: 'Prediction | RugZombie',
  },
  '/farms': {
    title: 'Farms | RugZombie',
  },
  '/graves': {
    title: 'Graves | RugZombie',
  },
  '/lottery': {
    title: 'Lottery | RugZombie',
  },
  '/collectibles': {
    title: 'Graveyard | RugZombie',
  },
  '/ifo': {
    title: 'Initial Farm Offering | RugZombie',
  },
  '/teams': {
    title: 'Leaderboard | RugZombie',
  },
  '/profile/tasks': {
    title: 'Task Center | RugZombie',
  },
  '/profile': {
    title: 'Your Profile | RugZombie',
  },
}
