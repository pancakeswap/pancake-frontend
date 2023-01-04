import { Box } from '@pancakeswap/uikit'
import { fetchAPI } from 'views/Blog/utils/api'
import markdownToHtml from 'views/Blog/utils/markdownToHtml'
import styled from 'styled-components'

const SingleBlogStyle = styled(Box)`
  width: 768px;
  margin: 100px auto;

  p {
    margin: 1.25em 0;
  }
`

const Blog = ({ plot }) => {
  return (
    <SingleBlogStyle>
      <div dangerouslySetInnerHTML={{ __html: plot }} />
    </SingleBlogStyle>
  )
}

export async function getStaticProps() {
  try {
    const filmResponse: any = await fetchAPI('/films/1')
    const plot = await markdownToHtml(filmResponse.data.attributes.Content)
    return {
      props: {
        plot,
        films: filmResponse.data,
      },
    }
  } catch (error) {
    console.log('Error', error)
    return {
      props: {
        plot: null,
        films: null,
      },
    }
  }
}

export default Blog
