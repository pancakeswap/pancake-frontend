import { Widget } from './Widget'
import Swap from './swap'

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap {...props} />
    </Widget>
  )
}
