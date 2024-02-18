import { ErrorIcon, Box, Text, AutoColumn, ColumnCenter } from '@pancakeswap/uikit'

export const TxErrorModalContent: React.FC<{
  title: React.ReactNode
  subTitle?: React.ReactNode
}> = ({ title, subTitle }) => {
  return (
    <Box width="100%">
      <Box mb="16px" padding="68px 44px 17px">
        <ColumnCenter>
          <ErrorIcon strokeWidth={0.5} width="80px" color="failure" />
        </ColumnCenter>
      </Box>
      <AutoColumn gap="12px" justify="center">
        <Text bold textAlign="center" color="failure">
          {title}
        </Text>
        {subTitle}
      </AutoColumn>
    </Box>
  )
}
