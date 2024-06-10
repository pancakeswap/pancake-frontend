import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Popper } from 'react-popper'

function isInDOMSubtree(element, subtreeRoot) {
  return subtreeRoot && (element === subtreeRoot || subtreeRoot.contains(element))
}

export const PopperWrapper = forwardRef(({ target, children, toggle, initOpen, ...props }: any, ref) => {
  const [isVisible, setVisibility] = useState(initOpen || false)
  const [targetElementIsVisible, setTargetElementIsVisible] = useState(false)

  const toggleVisibility = () => setVisibility((prevVisibility) => !prevVisibility)

  const elRef: any = useRef(document.getElementById(target))
  const popperRef = useRef(null)

  useImperativeHandle(ref, () => ({
    setVisibility,
  }))

  // eslint-disable-next-line consistent-return, react-hooks/exhaustive-deps
  const legacyClick = (e: any) => {
    if (e.target === elRef.current) {
      return toggleVisibility()
    }
    if (isVisible && !isInDOMSubtree(e.target, popperRef.current)) {
      setVisibility(false)
    }
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    elRef.current = document.getElementById(target)

    // HOVER
    if (toggle === 'hover') {
      elRef.current.addEventListener('mouseenter', toggleVisibility)
      elRef.current.addEventListener('mouseleave', toggleVisibility)
      return () => {
        elRef.current.removeEventListener('mouseenter', toggleVisibility)
        elRef.current.removeEventListener('mouseleave', toggleVisibility)
      }
    }

    // CLICK
    if (toggle === 'click') {
      elRef.current.addEventListener('click', toggleVisibility)
      return () => elRef.current.removeEventListener('click', toggleVisibility)
    }
  }, [target, toggle])

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // LEGACY
    if (toggle === 'legacy') {
      document.addEventListener('click', legacyClick)
      return () => {
        document.removeEventListener('click', legacyClick)
      }
    }
  }, [target, isVisible, toggle, legacyClick])

  useEffect(() => {
    if (elRef.current !== null && !targetElementIsVisible) {
      setTargetElementIsVisible(true)
    }
  }, [targetElementIsVisible])

  return createPortal(
    targetElementIsVisible && isVisible ? (
      // eslint-disable-next-line no-return-assign
      <Popper innerRef={(popper) => (popperRef.current = popper)} referenceElement={elRef.current} {...props}>
        {({ ref: newRef, style, placement, arrowProps }: any) => {
          return (
            <div className="popover" ref={newRef} style={style} data-placement={placement}>
              {children}
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )
        }}
      </Popper>
    ) : null,
    document.body,
  )
})
