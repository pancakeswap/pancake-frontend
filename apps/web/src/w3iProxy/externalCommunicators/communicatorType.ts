export type TTargetClient = 'auth' | 'chat' | 'notify'
export interface ExternalCommunicator {
  postToExternalProvider: <TReturn>(
    methodName: string,
    params: unknown,
    target: 'chat' | 'notify'
  ) => Promise<TReturn>
}
