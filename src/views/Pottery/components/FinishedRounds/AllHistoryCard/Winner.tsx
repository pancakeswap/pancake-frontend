import styled from 'styled-components'
import { Box, Flex, Text, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Container = styled(Flex)`
  min-width: 158px;
  max-width: 158px;
  padding: 4px 4px 4px 10px;
  border-top: solid 2px ${({ theme }) => theme.colors.cardBorder};
  margin: auto;
  &:first-child {
    border: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    &:first-child,
    &:nth-child(2) {
      border: 0;
    }
  }
`

const AvatarImage = styled.div<{ src: string }>`
  width: 24px;
  height: 24px;
  align-self: center;
  background: url('${({ src }) => src}');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
`

const Winner: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container>
      {/* <AvatarImage  src="https://static-nft.pancakeswap.com/mainnet/0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07/sleepy-1000.png" /> */}
      <BunnyPlaceholderIcon width="24px" height="24px" />
      <Box ml="4px">
        <Text fontSize="12px" color="primary">
          0x12...3f4c
        </Text>
        <Text fontSize="12px" color="primary">
          @MissPiggy
        </Text>
      </Box>
    </Container>
  )
}

export default Winner
