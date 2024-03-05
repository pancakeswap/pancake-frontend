import { useTranslation } from '@pancakeswap/localization'
import { OptionProps, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { TagType, TagValue } from './types'

export const useSelectorConfig = (): OptionProps[] => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  const options = useMemo(
    () => [
      {
        label: t('More'),
        value: TagValue.MORE,
      },
      {
        label: t(TagType.MISCELLANEOUS),
        value: TagValue.MISCELLANEOUS,
      },
      {
        label: t(TagType.ORACLE),
        value: TagValue.ORACLE,
      },
      {
        label: t(TagType.ORDER_TYPES),
        value: TagValue.ORDER_TYPES,
      },
      {
        label: t(TagType.CL_POOL),
        value: TagValue.CL_POOL,
      },
      {
        label: t(TagType.BIN_POOL),
        value: TagValue.BIN_POOL,
      },
      {
        label: t(TagType.LPs),
        value: TagValue.LPs,
      },
      {
        label: t(TagType.TRADERS),
        value: TagValue.TRADERS,
      },
    ],
    [t],
  )

  return isDesktop ? options.slice(1, options.length) : options
}
