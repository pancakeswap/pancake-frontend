import { useLayoutEffect } from 'react'

function addObserver(el: HTMLElement, callback: () => void) {
  // We are creating a new IntersectionObserver instance
  const ob = new IntersectionObserver((entries, observer) => {
    // This takes a callback function that receives two arguments: the elements list and the observer instance.
    entries.forEach((entry) => {
      // `entry.isIntersecting` will be true if the element is visible
      if (entry.isIntersecting) {
        callback()
        // We are removing the observer from the element after adding the active class
        observer.unobserve(entry.target)
      }
    })
  })
  // Adding the observer to the element
  ob.observe(el)
}

export const useObserver = (element: React.MutableRefObject<HTMLElement>, callback: () => void) => {
  useLayoutEffect(() => {
    if (element.current) addObserver(element.current, callback)
  }, [element, callback])
}
