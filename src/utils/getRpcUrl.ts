import { NODE_1, NODE_2, NODE_3 } from 'config'
import sample from 'lodash/sample'

const getNodeUrl = () => sample([NODE_1, NODE_2, NODE_3])

export default getNodeUrl
