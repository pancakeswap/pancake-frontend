import styled from 'styled-components'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ReleasedChart from './ReleasedChart'

const Dot = styled.div<{ isActive?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  align-self: center;
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : '#d7caec')};
`

const ReleasedTokenInfo: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Flex mb="24px">
      <ReleasedChart released={1} vested={3} />
      <Flex flexDirection="column" alignSelf="center" width="100%" ml="20px">
        <Flex justifyContent="space-between" mb="7px">
          <Flex>
            <Dot isActive />
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {t('Released')}
            </Text>
          </Flex>
          <Box ml="auto">
            <Text fontSize="14px" bold as="span">
              100.6967{' '}
            </Text>
            <Text fontSize="14px" as="span">
              (42.93%)
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Dot />
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {t('Vested')}
            </Text>
          </Flex>
          <Box ml="auto">
            <Text fontSize="14px" bold as="span">
              100.6967{' '}
            </Text>
            <Text fontSize="14px" as="span">
              (42.93%)
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ReleasedTokenInfo
