import { useEffect, useState, useCallback } from 'react';
import { useWalletRouting } from '@pancakeswap-libs/uikit';

const useKonamiCode = (action, {
    code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
} = {}) => {

    const [input, setInput] = useState([])

    const onKeyUp = useCallback((e) => {
        const newInput = input;
        newInput.push(e.keyCode)
        newInput.splice(-code.length - 1, input.length - code.length)
        setInput(newInput)

        if (newInput.join(' ').includes(code.join(' '))) {
            action()
        }

    }, [input, setInput, code, action])

    useEffect(() => {
        global.addEventListener('keyup', onKeyUp)
        return () => {
            global.removeEventListener('keyup', onKeyUp)
        }
    }, [onKeyUp])
}

export default () => {
    useKonamiCode(() => {
        useWalletRouting({
            imgSrc: '/images/bunny.svg', 
            size: 80
        })
    })
};