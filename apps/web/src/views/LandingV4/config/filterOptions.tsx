import { useTranslation } from '@pancakeswap/localization'
import { HooksIcon, OptionProps } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { ClammIcon } from 'views/LandingV4/components/Icons/ClammIcon'
import { LbammIcon } from 'views/LandingV4/components/Icons/LbammIcon'
import { LpsIcon } from 'views/LandingV4/components/Icons/LpsIcon'
import { MiscellaneousIcon } from 'views/LandingV4/components/Icons/MiscellaneousIcon'
import { OracleIcon } from 'views/LandingV4/components/Icons/OracleIcon'
import { TradersIcon } from 'views/LandingV4/components/Icons/TradersIcon'
import { TagType, TagValue } from 'views/LandingV4/config/types'

interface SelectorConfigProps extends OptionProps {
  id: TagValue
  icon: JSX.Element
}

export const useSelectorConfig = (): SelectorConfigProps[] => {
  const { t } = useTranslation()

  const options = useMemo(
    () => [
      {
        label: t(TagType.MISCELLANEOUS),
        id: TagValue.MISCELLANEOUS,
        value: TagValue.MISCELLANEOUS,
        icon: <MiscellaneousIcon width={12} height={12} />,
      },
      {
        label: t(TagType.ORACLE),
        id: TagValue.ORACLE,
        value: TagValue.ORACLE,
        icon: <OracleIcon width={12} height={12} />,
      },
      {
        label: t(TagType.ORDER_TYPES),
        id: TagValue.ORDER_TYPES,
        value: TagValue.ORDER_TYPES,
        icon: <HooksIcon width={12} height={12} />,
      },
      {
        label: t(TagType.CLAMM),
        id: TagValue.CLAMM,
        value: TagValue.CLAMM,
        icon: <ClammIcon width={12} height={12} />,
      },
      {
        label: t(TagType.LBAMM),
        id: TagValue.LBAMM,
        value: TagValue.LBAMM,
        icon: <LbammIcon width={12} height={12} />,
      },
      {
        label: t(TagType.LPs),
        id: TagValue.LPs,
        value: TagValue.LPs,
        icon: <LpsIcon width={12} height={12} />,
      },
      {
        label: t(TagType.TRADERS),
        id: TagValue.TRADERS,
        value: TagValue.TRADERS,
        icon: <TradersIcon width={12} height={12} />,
      },
    ],
    [t],
  )

  return options
}
