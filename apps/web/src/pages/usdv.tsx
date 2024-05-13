import dynamic from 'next/dynamic'

const View = dynamic(() => import('views/USDV').then((res) => res.USDVView))

const USDVPage = () => <View />

USDVPage.chains = [] as any

export default USDVPage
