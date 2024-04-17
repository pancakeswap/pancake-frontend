import jazzicon from '@metamask/jazzicon'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, FlexGap, Tag, Text } from '@pancakeswap/uikit'
import { useLayoutEffect, useRef } from 'react'
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

const SIZE = 36

export const Winners = () => {
  const { t } = useTranslation()
  const iconRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const { current } = iconRef

    for (let i = 0; i < 48; i++) {
      const icon = jazzicon(SIZE, i)
      current?.appendChild(icon)
    }
  }, [iconRef])

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
          <FlexGap gap="16px" justifyContent="center" flexWrap="wrap" ref={iconRef} />
        </Container>
      </Card>
    </Flex>
  )
}
