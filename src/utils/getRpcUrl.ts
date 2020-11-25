import random from 'lodash/random'

const node1 = process.env.REACT_APP_NODE_1
const node2 = process.env.REACT_APP_NODE_2

// Array of available nodes to connect to
const nodes = [node1, node2]

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export default getNodeUrl
