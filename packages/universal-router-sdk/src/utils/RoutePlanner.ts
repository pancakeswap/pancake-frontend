import { Hex } from 'viem'
import { CommandType } from '../router.types'
import { ABIParametersType, CommandUsed, createCommand } from './createCommand'
import { ActionUsed, createAction, V4ActionsABIParametersType } from './createV4Action'

export class RoutePlanner {
  commands: Hex

  inputs: Hex[]

  constructor() {
    this.commands = '0x'
    this.inputs = []
  }

  addSubPlan(type: CommandType.V4_SWAP | CommandType.EXECUTE_SUB_PLAN, plan: RoutePlanner) {
    this.addCommand(type, [plan.commands, plan.inputs])
  }

  addAction<TActionType extends ActionUsed>(type: TActionType, parameters: V4ActionsABIParametersType<TActionType>) {
    const action = createAction(type, parameters)
    this.inputs.push(action.encodedInput)
    this.commands = this.commands.concat(action.type.toString(16).padStart(2, '0')) as Hex
  }

  addCommand<TCommandType extends CommandUsed>(
    type: TCommandType,
    parameters: ABIParametersType<TCommandType>,
    allowRevert = false,
  ): void {
    const command = createCommand(type, parameters)
    this.inputs.push(command.encodedInput)
    if (allowRevert) {
      if (!REVERTIBLE_COMMANDS.has(command.type)) {
        throw new Error(`command type: ${command.type} cannot be allowed to revert`)
      }
      // eslint-disable-next-line no-bitwise
      command.type |= ALLOW_REVERT_FLAG
    }

    this.commands = this.commands.concat(command.type.toString(16).padStart(2, '0')) as Hex
  }
}

const ALLOW_REVERT_FLAG = 0x80

const REVERTIBLE_COMMANDS = new Set<CommandType>([
  // CommandType.SEAPORT_V1_5,
  // CommandType.SEAPORT_V1_4,
  // CommandType.LOOKS_RARE_V2,
  // CommandType.X2Y2_721,
  // CommandType.X2Y2_1155,
  CommandType.EXECUTE_SUB_PLAN,
])
