import React from 'react'
import ReactMarkdownLib, { Options as ReactMarkdownOptions, Components } from 'react-markdown'
import gfm from 'remark-gfm'
import markdownComponents from './styles'

const ReactMarkdown: React.FC<ReactMarkdownOptions> = (props) => {
  return <ReactMarkdownLib remarkPlugins={[gfm]} components={markdownComponents as Components} {...props} />
}

export default ReactMarkdown
