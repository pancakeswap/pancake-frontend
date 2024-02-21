import shuffle from 'lodash/shuffle'
import { GameType } from '../../types'
// Project
import { binaryX } from './binaryX'
import { nemesisDownfall } from './nemesisDownfall'
import { pancakeProtectors } from './pancakeProtectors'

export const TOP_GAMES_LIST: GameType[] = [pancakeProtectors]

export const DEFAULT_GAMES_LIST: GameType[] = [nemesisDownfall, binaryX]

export const GAMES_LIST = [...TOP_GAMES_LIST, ...shuffle(DEFAULT_GAMES_LIST)]
