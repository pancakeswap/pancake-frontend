import Ajv from 'ajv'
import schema from './schema/pancakeswap.json'

export const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)
