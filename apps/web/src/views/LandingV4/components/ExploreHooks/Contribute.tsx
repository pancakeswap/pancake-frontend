import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Card, Flex, LibraryIcon, OpenNewIcon, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { styled } from 'styled-components'

const ImageUI = styled(Flex)`
  display: none;
  flex: 4;
  background-size: contain;
  background-position: center right;
  background-repeat: no-repeat;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

export const Contribute = () => {
  const { t } = useTranslation()

  return (
    <Box mt="40px">
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
              {t(`Build Hooks with us and participate in PancakeSwap's 500k USD Developer Program`)}
            </Text>
            <Flex flexDirection={['column', 'column', 'row']} margin={['auto', 'auto', 'auto', '0']}>
              <NextLinkFromReactRouter
                target="_blank"
                to="https://pancakeswapforms.fillout.com/PancakeSwap_Hooks_Submission"
              >
                <Button display="flex" margin="auto">
                  <Text color="white" bold fontSize={['12px', '16px']} mr="4px">
                    {t('Submit Your Hook')}
                  </Text>
                  <OpenNewIcon color="white" />
                </Button>
              </NextLinkFromReactRouter>
              <NextLinkFromReactRouter
                target="_blank"
                to="https://blog.pancakeswap.finance/articles/introducing-pancake-swap-s-500-k-developer-program-and-cake-emissions-grant-program?utm_source=v4landingpage&utm_medium=banner&utm_campaign=v4landingpage&utm_id=v4landingpage"
              >
                <Button variant="secondary" display="flex" m={['8px auto 0 auto', '8px auto 0 auto', '0 0 0 8px']}>
                  <Text color="primary" bold fontSize={['12px', '16px']} mr="4px">
                    {t('Get Rewarded with Developer Program')}
                  </Text>
                  <OpenNewIcon color="primary" />
                </Button>
              </NextLinkFromReactRouter>
            </Flex>
          </Flex>
          <ImageUI
            style={{
              backgroundImage: `url('${ASSET_CDN}/web/v4-landing/contribute.png')`,
            }}
          />
        </Flex>
      </Card>
    </Box>
  )
}
