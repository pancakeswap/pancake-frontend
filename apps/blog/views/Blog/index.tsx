import { Box, Flex, Button } from '@pancakeswap/uikit'
import NewBlog from 'views/Blog/components/NewBlog'
import ChefsChoice from 'views/Blog/components/ChefsChoice'
import { useTranslation } from '@pancakeswap/localization'
import NextLink from 'next/link'

const Blog = () => {
  const { t } = useTranslation()

  return (
    <Box width="100%" mb="150px">
      <NewBlog />
      <ChefsChoice />
      <Flex justifyContent="center" m="50px auto">
        <NextLink href="/blog/article" passHref>
          <Button scale="md" variant="secondary">
            {t('More')}
          </Button>
        </NextLink>
      </Flex>
    </Box>
  )
}

export default Blog
