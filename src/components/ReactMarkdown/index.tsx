import React from 'react'
import ReactMarkdownLib, { ReactMarkdownOptions } from 'react-markdown'
import markdownComponents from './styles'

const ReactMarkdown: React.FC<ReactMarkdownOptions> = (props) => {
  return <ReactMarkdownLib components={markdownComponents} {...props} />
}

export default ReactMarkdown
