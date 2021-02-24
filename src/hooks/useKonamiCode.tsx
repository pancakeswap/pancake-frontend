import { useState, useEffect } from 'react';

const useKonamiCode = (completeComboCallback: { (): void; (): void; }) => {
  console.log('[debug] init!') // TODO: remove this

  // ↑ ↑ ↓ ↓ ← → ← → b a
  const KONAMI_COMBO = Object.freeze([38, 38, 40, 40, 37, 39, 37, 39, 66, 65])
  const KONAMI_COMBO_S = KONAMI_COMBO.join(' ')
  // currentKeyCombo should be an Array of Numbers
  const [currentKeyCombo, setCurrentKeyCombo] = useState([])

  const resetCurrentKeyCombo = () => {
    setCurrentKeyCombo([])
  }

  const handleKeyUp = (e) => {
    const keyCombo = currentKeyCombo.slice()
    if (keyCombo.length === 0 && e.keyCode !== KONAMI_COMBO[0]) {
      return;
    }

    const newKeyCombo = keyCombo.concat([Number(e.keyCode)])
    if (newKeyCombo.join(' ') !== KONAMI_COMBO.slice(0, newKeyCombo.length).join(' ')) {
      resetCurrentKeyCombo()
      return;
    }

    if (newKeyCombo.join(' ') === KONAMI_COMBO_S) {
      resetCurrentKeyCombo()
      completeComboCallback()
    } else {
      setCurrentKeyCombo(newKeyCombo)
    }
  }

  useEffect(() => {
    const keyUpEvent = 'keyup'
    const keyUpHandler = handleKeyUp
    global.addEventListener(keyUpEvent, keyUpHandler)
    return () => {
      global.removeEventListener(keyUpEvent, keyUpHandler)
    }
  })
}

export default useKonamiCode
