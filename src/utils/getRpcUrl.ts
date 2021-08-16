import sample from 'lodash/sample'

// Array of available nodes to connect to
export const nodes =
  process.env.REACT_APP_USING_FORK === 'true'
    ? [process.env.REACT_APP_NODE_FORK]
    : [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

const getNodeUrl = () => {
  return sample(nodes)
}

export default getNodeUrl
