import random from 'lodash/random'

// Array of available nodes to connect to
const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2]

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export default getNodeUrl
