import { Box, Flex, Spinner, Text } from '@pancakeswap/uikit'

interface LoadingProps {
  title: string
}

export const Loading: React.FC<React.PropsWithChildren<LoadingProps>> = ({ title, children }) => {
  return (
    <Flex width="100%" flexDirection="column">
      <Box margin="auto auto 24px auto">
        <Spinner size={100} />
      </Box>
      {children}
      <Text textAlign="center" color="textSubtle" mt="20px">
        {title}
      </Text>
    </Flex>
  )
}
