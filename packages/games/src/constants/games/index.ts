import shuffle from 'lodash/shuffle'
import { Game } from '../../types'
// Project
import { example } from './example'

export const TOP_GAMES_LIST: Game[] = []

export const DEFAULT_GAMES_LIST: Game[] = [example]

export const GAMES_LIST = [...TOP_GAMES_LIST, ...shuffle(DEFAULT_GAMES_LIST)]
