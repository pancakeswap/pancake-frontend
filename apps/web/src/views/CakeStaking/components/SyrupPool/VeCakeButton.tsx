import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { memo } from 'react'

const BUTTON_TEXT = {
  get: 'Get veCAKE now!',
  migrate: 'Migrate to veCAKE',
  check: 'Check out veCAKE',
}

export const VeCakeButton: React.FC<{ type: 'get' | 'migrate' | 'check'; style?: React.CSSProperties }> = memo(
  ({ type, style }) => {
    const { push } = useRouter()
    const { t } = useTranslation()
    return (
      <Button
        width="100%"
        style={style}
        onClick={() => {
          push('/cake-staking')
        }}
      >
        {t(BUTTON_TEXT[type])}
      </Button>
    )
  },
)
