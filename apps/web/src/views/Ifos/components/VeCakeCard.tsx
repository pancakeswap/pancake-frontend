import { Ifo } from '@pancakeswap/widgets-internal'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Link from 'next/link'
import { SpaceProps } from 'styled-system'

function NavigateButton(props: SpaceProps) {
  const { t } = useTranslation()

  return (
    <Button width="100%" as={Link} href="/cake-staking" {...props}>
      {t('Go to CAKE Staking')}
    </Button>
  )
}

export function VeCakeCard() {
  const header = (
    <>
      <Ifo.MyICake />
      <Ifo.IfoSalesLogo />
    </>
  )

  return (
    <Ifo.VeCakeCard header={header}>
      <Ifo.MyVeCake amount={1000000} />
      <Ifo.ICakeInfo mt="1.5rem" snapshot={Date.now() / 1000} />
      <Ifo.ZeroVeCakeTips mt="1.5rem" />
      <NavigateButton mt="1.5rem" />
    </Ifo.VeCakeCard>
  )
}
