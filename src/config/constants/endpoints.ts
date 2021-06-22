import { BASE_SUBGRAPH_URL } from 'config'

export const GRAPH_API_PROFILE = `${BASE_SUBGRAPH_URL}/profile`
export const GRAPH_API_PREDICTION = `${BASE_SUBGRAPH_URL}/prediction`
export const GRAPH_API_LOTTERY = `${BASE_SUBGRAPH_URL}/lottery`
export const ARCHIVED_NODE = process.env.REACT_APP_ARCHIVED_NODE
export const SNAPSHOT_VOTING_API = process.env.REACT_APP_SNAPSHOT_VOTING_API
export const SNAPSHOT_BASE_URL = process.env.REACT_APP_SNAPSHOT_BASE_URL
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
