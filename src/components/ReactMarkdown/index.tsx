import ReactMarkdownLib from 'react-markdown'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'
import gfm from 'remark-gfm'
import markdownComponents from './styles'

const ReactMarkdown: React.FC<ReactMarkdownOptions & { children?: React.ReactNode }> = (props) => {
  return <ReactMarkdownLib remarkPlugins={[gfm]} components={markdownComponents} {...props} />
}

export default ReactMarkdown
