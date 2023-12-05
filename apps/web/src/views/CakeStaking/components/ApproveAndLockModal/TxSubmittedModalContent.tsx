import { ArrowUpIcon, Box, Text, AutoColumn, ColumnCenter, CheckmarkCircleIcon } from '@pancakeswap/uikit'

export const TxSubmittedModalContent: React.FC<{
  title: React.ReactNode
  subTitle?: React.ReactNode
  confirmed?: boolean
}> = ({ title, subTitle, confirmed }) => {
  return (
    <Box width="100%">
      <Box mb="16px" padding="68px 44px 17px">
        <ColumnCenter>
          {confirmed ? (
            <ArrowUpIcon strokeWidth={0.5} width="80px" color="primary" />
          ) : (
            <CheckmarkCircleIcon strokeWidth={0.5} width="80px" color="primary" />
          )}
        </ColumnCenter>
      </Box>
      <AutoColumn gap="12px" justify="center">
        <Text bold textAlign="center">
          {title}
        </Text>
        {subTitle}
      </AutoColumn>
    </Box>
  )
}
