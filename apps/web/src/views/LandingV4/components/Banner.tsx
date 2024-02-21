import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Image, OpenNewIcon, PageSection, Tag, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'
import { SlideSvgDark, SlideSvgLight } from 'views/Home/components/SlideSvg'

const StyledBannerSection = styled(PageSection)`
  padding: 40px 0;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 128px 0;
  }
`
const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

export const Banner = () => {
  const { t } = useTranslation()

  return (
    <>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #f3efff 0%, #e6fdff 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
          }

          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
            > path {
              fill: #faf9fa !important;
            }
          }
          [data-theme='dark'] .slide-svg-dark {
            display: block;
          }
          [data-theme='dark'] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      <StyledBannerSection
        innerProps={{ style: { margin: '0', width: '100%', overflow: 'visible', padding: '16px' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <BgWrapper>
          <InnerWrapper>
            <SlideSvgDark className="slide-svg-dark" width="100%" />
            <SlideSvgLight className="slide-svg-light" width="100%" />
          </InnerWrapper>
        </BgWrapper>
        <Flex flexDirection={['column', 'column', 'column', 'row']}>
          <Flex
            m={['22px 0 0 0 0', '22px 0 0 0 0', '22px 0 0 0 0', '0 0 0 48px']}
            maxWidth={['560px']}
            alignSelf="center"
            flexDirection="column"
          >
            <Box m={['16px auto', '16px auto', '16px auto', '24px 0']}>
              <Tag variant="secondary">{t('PancakeSwap v4')}</Tag>
            </Box>
            <Box>
              <Flex justifyContent={['center', 'center', 'center', 'left']}>
                <Text
                  bold
                  fontSize={['40px', '40px', '40px', '48px']}
                  lineHeight={['40px', '40px', '40px', '48px']}
                  as="span"
                >
                  {t('Your')}
                </Text>
                <Text
                  bold
                  as="span"
                  m="0 4px"
                  color="secondary"
                  fontSize={['40px', '40px', '40px', '48px']}
                  lineHeight={['40px', '40px', '40px', '48px']}
                >
                  {t('DEX')}
                </Text>
                <Text
                  bold
                  as="span"
                  fontSize={['40px', '40px', '40px', '48px']}
                  lineHeight={['40px', '40px', '40px', '48px']}
                >
                  ,
                </Text>
              </Flex>
              <Flex justifyContent={['center', 'center', 'center', 'left']}>
                <Text
                  bold
                  as="span"
                  fontSize={['40px', '40px', '40px', '48px']}
                  lineHeight={['40px', '40px', '40px', '48px']}
                >
                  {t('Your')}
                </Text>
                <Text
                  bold
                  ml="4px"
                  as="span"
                  color="secondary"
                  fontSize={['40px', '40px', '40px', '48px']}
                  lineHeight={['40px', '40px', '40px', '48px']}
                >
                  {t('Innovation')}
                </Text>
              </Flex>
            </Box>
            <Text
              bold
              fontSize={['20px']}
              lineHeight="110%"
              color="textSubtle"
              m={['16px 0', '16px 0', '16px 0', '24px 0']}
              textAlign={['center', 'center', 'center', 'left']}
            >
              {t('Empower, Build and Innovate with PancakeSwap v4')}
            </Text>
            <NextLinkFromReactRouter
              target="_blank"
              to="https://blog.pancakeswap.finance/articles/celebrating-traverse-claim-your-exclusive-nfts"
            >
              <Button display="flex" margin={['auto', 'auto', 'auto', '0']}>
                <Text bold fontSize={['12px', '16px']} mr="4px">
                  {t('Read Whitepaper')}
                </Text>
                <OpenNewIcon />
              </Button>
            </NextLinkFromReactRouter>
          </Flex>
          <Box
            height={['337px']}
            width={['100%', '600px']}
            m={['40px auto auto auto', '40px auto auto auto', '40px auto auto auto', 'auto']}
          >
            <Image
              width={600}
              height={337}
              alt="banner-image"
              src="https://img.freepik.com/free-vector/gradient-geometric-modern-background-design_826849-4176.jpg?w=1800&t=st=1708491776~exp=1708492376~hmac=1a36ca65d7f91ebdf21c9052f666b6624283a18b69c9caf5219749cc20889899"
            />
          </Box>
        </Flex>
      </StyledBannerSection>
    </>
  )
}
