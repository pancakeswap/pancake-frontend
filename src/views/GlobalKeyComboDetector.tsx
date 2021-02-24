import useKonamiCode from 'hooks/useKonamiCode';

const GlobalKeyComboDetector = () => {

  const completeComboCallback = () => {
    // TODO: show pancake-flake effect
    alert('C-C-COMBO!!')
  }

  useKonamiCode(completeComboCallback)

  return null;
}

export default GlobalKeyComboDetector
