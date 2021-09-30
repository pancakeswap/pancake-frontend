import sample from 'lodash/sample'

if (!process.env.REACT_APP_NODE_1 || !process.env.REACT_APP_NODE_2 || !process.env.REACT_APP_NODE_3) {
  throw Error('One base RPC URL is undefined')
}

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_NODE_ALT) {
  nodes.push(process.env.REACT_APP_NODE_ALT)
}

const getNodeUrl = () => {
  return sample(nodes)
}

export default getNodeUrl
