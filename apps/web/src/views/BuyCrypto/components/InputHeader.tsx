import { Flex, BuyCrypto } from '@pancakeswap/uikit'
import { ReactElement, memo } from 'react'

interface Props {
  title: string | ReactElement
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const InputHeader: React.FC<React.PropsWithChildren<Props>> = memo(({ subtitle, title }) => {
  const titleContent = (
    <Flex width="100%" alignItems="center" justifyContent="space-between" flexDirection="column">
      <Flex flexDirection="column" alignItems="flex-start" width="100%" marginBottom={15}>
        <BuyCrypto.InputHeaderTitle>{title}</BuyCrypto.InputHeaderTitle>
      </Flex>
      <Flex justifyContent="start" width="100%" height="17px" alignItems="center" mb="14px">
        <BuyCrypto.InputHeaderSubTitle>{subtitle}</BuyCrypto.InputHeaderSubTitle>
      </Flex>
    </Flex>
  )

  return <BuyCrypto.InputHeader title={titleContent} subtitle={<></>} />
})

export default InputHeader
