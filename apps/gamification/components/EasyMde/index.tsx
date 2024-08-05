import EasyMde from 'easymde'
import merge from 'lodash/merge'
import { TextareaHTMLAttributes, useEffect, useRef } from 'react'
import { styled } from 'styled-components'

import 'easymde/dist/easymde.min.css'

interface SimpleMdeProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  options?: EasyMde.Options
  onTextChange: (value: string) => void
}

const Wrapper = styled.div`
  .EasyMDEContainer .CodeMirror {
    background: ${({ theme }) => theme.colors.input};
    border-color: ${({ theme }) => theme.colors.cardBorder};
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    box-shadow: ${({ theme }) => theme.shadows.inset};
    padding: 16px;
  }

  .CodeMirror-code {
    color: ${({ theme }) => theme.colors.text};
  }

  .CodeMirror-cursor {
    border-left: ${({ theme }) => `1px solid ${theme.colors.text}`};
  }

  .editor-toolbar {
    background: ${({ theme }) => theme.card.background};
    border-color: ${({ theme }) => theme.colors.cardBorder};
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    color: ${({ theme }) => theme.colors.text};

    a,
    button {
      color: ${({ theme }) => theme.colors.text};

      &:hover,
      &.active {
        background: ${({ theme }) => theme.colors.background};
        border: 0;
      }
    }
  }
`

/**
 * @see https://github.com/Ionaru/easy-markdown-editor#configuration
 */
const defaultOptions: EasyMde.Options = {
  autofocus: false,
  status: false,
  hideIcons: ['guide', 'fullscreen', 'preview', 'side-by-side'],
  spellChecker: false,
  styleSelectedText: false,
}

const SimpleMde: React.FC<React.PropsWithChildren<SimpleMdeProps>> = ({ options, onTextChange, ...props }) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const onTextChangeHandler = useRef(onTextChange)

  useEffect(() => {
    let simpleMde: EasyMde | null = new EasyMde(merge({ element: ref.current }, defaultOptions, options))

    const handler = () => {
      if (simpleMde) {
        onTextChangeHandler.current(simpleMde.value())
      }
    }

    simpleMde.codemirror.on('change', handler)

    return () => {
      if (simpleMde) {
        simpleMde.toTextArea()
        simpleMde.codemirror.off('change', handler)
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
