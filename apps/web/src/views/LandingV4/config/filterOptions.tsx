import { useTranslation } from '@pancakeswap/localization'
import { HooksIcon, OptionProps, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { ClammIcon } from 'views/LandingV4/components/Icons/ClammIcon'
import { LbammIcon } from 'views/LandingV4/components/Icons/LbammIcon'
import { LpsIcon } from 'views/LandingV4/components/Icons/LpsIcon'
import { MiscellaneousIcon } from 'views/LandingV4/components/Icons/MiscellaneousIcon'
import { OracleIcon } from 'views/LandingV4/components/Icons/OracleIcon'
import { TradersIcon } from 'views/LandingV4/components/Icons/TradersIcon'
import { TagType, TagValue } from 'views/LandingV4/config/types'

interface SelectorConfigProps extends OptionProps {
  icon: JSX.Element
}

export const useSelectorConfig = (): SelectorConfigProps[] => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  const options = useMemo(
    () => [
      {
        label: t('More'),
        value: TagValue.MORE,
        icon: <></>,
      },
      {
        label: t(TagType.MISCELLANEOUS),
        value: TagValue.MISCELLANEOUS,
        icon: <MiscellaneousIcon width={12} height={12} />,
      },
      {
        label: t(TagType.ORACLE),
        value: TagValue.ORACLE,
        icon: <OracleIcon width={12} height={12} />,
      },
      {
        label: t(TagType.ORDER_TYPES),
        value: TagValue.ORDER_TYPES,
        icon: <HooksIcon width={12} height={12} />,
      },
      {
        label: t(TagType.CL_POOL),
        value: TagValue.CL_POOL,
        icon: <ClammIcon width={12} height={12} />,
      },
      {
        label: t(TagType.BIN_POOL),
        value: TagValue.BIN_POOL,
        icon: <LbammIcon width={12} height={12} />,
      },
      {
        label: t(TagType.LPs),
        value: TagValue.LPs,
        icon: <LpsIcon width={12} height={12} />,
      },
      {
        label: t(TagType.TRADERS),
        value: TagValue.TRADERS,
        icon: <TradersIcon width={12} height={12} />,
      },
    ],
    [t],
  )

  return isDesktop ? options.slice(1, options.length) : options
}
