import { Ifo } from '@pancakeswap/widgets-internal'

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
    </Ifo.VeCakeCard>
  )
}
