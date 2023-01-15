import { Box, Text, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import BlogCard from 'components/Blog/BlogCard'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'

const StyledBackground = styled(Box)<{ isDark: boolean }>`
  position: relative;
  padding: 45px 16px 0 16px;

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 90%;
    background: ${({ isDark }) => (isDark ? NEW_BLOG_BG_DARK : NEW_BLOG_BG)};
    border-bottom-left-radius: 50% 5%;
    border-bottom-right-radius: 50% 5%;
  }
`

const NEW_BLOG_BG = 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)'
const NEW_BLOG_BG_DARK = 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)'

const NewBlog = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <StyledBackground isDark={isDark}>
      <Box maxWidth="1137px" margin="auto">
        <NextLinkFromReactRouter to="/blog/article/1">
          <Text bold fontSize={['32px', '32px', '40px']}>
            {t('Blog')}
          </Text>
          <Text bold mt="4px" mb={['20px', '20px', '35px']} color="textSubtle" fontSize={['14px', '14px', '16px']}>
            {t('Latest News about PancakeSwap and more!')}
          </Text>
          <BlogCard
            maxWidth="880px"
            margin="auto"
            imgHeight={['155px', '250px', '350px', '500px']}
            imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
          />
        </NextLinkFromReactRouter>
      </Box>
    </StyledBackground>
  )
}

export default NewBlog
