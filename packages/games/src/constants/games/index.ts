import shuffle from 'lodash/shuffle'
import { GameType } from '../../types'
// Project
import { example } from './example'

export const TOP_GAMES_LIST: GameType[] = []

export const DEFAULT_GAMES_LIST: GameType[] = [example]

export const GAMES_LIST = [...TOP_GAMES_LIST, ...shuffle(DEFAULT_GAMES_LIST)]
