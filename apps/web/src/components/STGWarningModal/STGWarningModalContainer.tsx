import { STGWarningModal } from '.'
import { useHasSTGLP } from './useHasSTGLP'

export function STGWarningModalContainer() {
  const hasSTPLPonBSC = useHasSTGLP()

  return <STGWarningModal openWarning={hasSTPLPonBSC} />
}
