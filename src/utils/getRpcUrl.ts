import sample from 'lodash/sample'

// Array of available nodes to connect to
export const nodes = [
  process.env.REACT_APP_NODE_1,
  process.env.REACT_APP_NODE_2,
  process.env.REACT_APP_NODE_3,
  // process.env.REACT_APP_NODE_4,
]

if (process.env.NODE_ENV === 'production') {
  nodes.push(process.env.REACT_APP_NODE_4)
}

const getNodeUrl = () => {
  return sample(nodes)
}

export default getNodeUrl
