import React, { TextareaHTMLAttributes, useEffect, useRef } from 'react'
import SimpleMDE from 'simplemde'
import styled from 'styled-components'
import merge from 'lodash/merge'

import 'simplemde/dist/simplemde.min.css'

interface SimpleMdeProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  options?: SimpleMDE.Options
  onTextChange: (value: string) => void
}

const Wrapper = styled.div`
  .CodeMirror {
    background: ${({ theme }) => theme.colors.input};
    border-color: ${({ theme }) => theme.colors.cardBorder};
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    box-shadow: ${({ theme }) => theme.shadows.inset};
    padding: 16px;
  }

  .CodeMirror-line {
    color: ${({ theme }) => theme.colors.text};
  }

  .editor-toolbar {
    background: ${({ theme }) => theme.card.background};
    border-color: ${({ theme }) => theme.colors.cardBorder};
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;

    a {
      color: ${({ theme }) => theme.colors.text} !important; // <-- Dammit simplemde!
    }
  }
`

/**
 * @see https://github.com/sparksuite/simplemde-markdown-editor
 */
const defaultOptions: SimpleMDE.Options = {
  autofocus: false,
  status: false,
  hideIcons: ['guide'],
  spellChecker: false,
  styleSelectedText: false,
}

const SimpleMde: React.FC<SimpleMdeProps> = ({ options, onTextChange, ...props }) => {
  const ref = useRef()
  const onTextChangeHandler = useRef(onTextChange)

  useEffect(() => {
    let simpleMde = new SimpleMDE(merge({ element: ref.current }, defaultOptions, options))

    simpleMde.codemirror.on('change', () => {
      onTextChangeHandler.current(simpleMde.value())
    })

    return () => {
      if (simpleMde) {
        simpleMde.toTextArea()
        simpleMde = null
      }
    }
  }, [options, onTextChangeHandler, ref])

  return (
    <Wrapper>
      <textarea ref={ref} readOnly {...props} />
    </Wrapper>
  )
}

export default SimpleMde
