import shuffle from 'lodash/shuffle'

export const TOP_GAMES_LIST = []

export const DEFAULT_GAMES_LIST = []

export const GAMES_LIST = [...TOP_GAMES_LIST, ...shuffle(DEFAULT_GAMES_LIST)]
