import { Box, Text } from '@pancakeswap/uikit'
import BlogCard from 'components/Blog/BlogCard'
import styled from 'styled-components'
import { useTheme } from 'next-themes'

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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <StyledBackground isDark={isDark}>
      <Box maxWidth="1137px" margin="auto">
        <Text bold fontSize={['32px', '32px', '40px']}>
          Blog
        </Text>
        <Text bold mt="4px" mb={['20px', '20px', '35px']} color="textSubtle" fontSize={['14px', '14px', '16px']}>
          Latest News about PancakeSwap and more!
        </Text>
        <BlogCard
          maxWidth="880px"
          margin="auto"
          imgHeight={['155px', '250px', '350px', '500px']}
          imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
        />
      </Box>
    </StyledBackground>
  )
}

export default NewBlog
