import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Card, Flex, LibraryIcon, OpenNewIcon, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'

const ImageUI = styled(Flex)`
  display: none;
  flex: 4;
  background-size: cover;
  background-position: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

export const Contribute = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <Flex>
        <Flex
          flex={6}
          flexDirection="column"
          padding={['24px', '24px', '24px', '24px', '40px']}
          alignItems={['center', 'center', 'center', 'center', 'flex-start']}
        >
          <Box>
            <LibraryIcon color="secondary" width={24} height={24} />
          </Box>
          <Text
            bold
            mt={['24px']}
            fontSize={['24px', '24px', '24px', '28px']}
            lineHeight={['28px', '28px', '28px', '28px', '32px']}
            textAlign={['center', 'center', 'center', 'center', 'left']}
          >
            {t('Contribute to PancakeSwap v4')}
          </Text>
          <Text lineHeight="24px" textAlign={['center', 'center', 'center', 'center', 'left']} m={['16px 0 32px 0']}>
            {t(`Build Hooks with us and participate in PancakeSwap's One Million USD Developer Program`)}
          </Text>
          <NextLinkFromReactRouter target="_blank" to="https://forms.gle/tZNXcQbfvgj1XAJq5">
            <Button display="flex" margin={['auto', 'auto', 'auto', '0']}>
              <Text bold fontSize={['12px', '16px']} mr="4px">
                {t('Submit Your Hook')}
              </Text>
              <OpenNewIcon />
            </Button>
          </NextLinkFromReactRouter>
        </Flex>
        <ImageUI
          style={{
            backgroundImage: `url(https://img.freepik.com/free-vector/gradient-geometric-modern-background-design_826849-4176.jpg?w=1800&t=st=1708491776~exp=1708492376~hmac=1a36ca65d7f91ebdf21c9052f666b6624283a18b69c9caf5219749cc20889899)`,
          }}
        />
      </Flex>
    </Card>
  )
}
