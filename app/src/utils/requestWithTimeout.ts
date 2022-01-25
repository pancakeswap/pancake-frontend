import { GraphQLClient } from 'graphql-request'

const requestWithTimeout = <T extends any>(
  graphQLClient: GraphQLClient,
  request: string,
  variables?: any,
  timeout = 30000,
): Promise<T> => {
  return Promise.race([
    variables ? graphQLClient.request<T>(request, variables) : graphQLClient.request<T>(request),
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timed out after ${timeout} milliseconds`))
      }, timeout)
    }),
  ]) as Promise<T>
}

export default requestWithTimeout
