import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import Jazzicon from 'react-jazzicon'
import { styled } from 'styled-components'

const Container = styled(Box)`
  position: relative;
  padding: 16px;
  max-height: 172px;

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: ${({ theme }) =>
      `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.colors.backgroundAlt} 100%)`};
  }
`

const TOTAL = 20
const SIZE = 36

export const Winners = () => {
  const { t } = useTranslation()

  const winners = useMemo(() => {
    const array = []
    for (let i = 0; i < TOTAL; i++) {
      array.push(i)
    }
    return array
  }, [])

  return (
    <Flex mt="32px" flexDirection="column">
      <Flex mb="16px">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Winners')}
        </Text>
        <Box style={{ alignSelf: 'center' }}>
          <Tag variant="textDisabled" outline>
            999
          </Tag>
        </Box>
      </Flex>
      <Card>
        <Container>
          <FlexGap gap="16px" justifyContent="center" flexWrap="wrap">
            {winners.map((i) => (
              <Jazzicon seed={i} diameter={SIZE} />
            ))}
          </FlexGap>
        </Container>
      </Card>
    </Flex>
  )
}
