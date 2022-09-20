/* eslint-disable no-restricted-syntax */
import clsx, { ClassValue } from 'clsx'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { atoms, Atoms } from '../css/atoms'
import { sprinkles } from '../css/sprinkles.css'

type HTMLProperties<T = HTMLElement> = Omit<
  React.AllHTMLAttributes<T>,
  'as' | 'className' | 'color' | 'height' | 'width' | 'size'
>

type Props = Atoms &
  HTMLProperties & {
    as?: React.ElementType
    asChild?: boolean
    className?: ClassValue
  }

export const AtomBox = React.forwardRef<HTMLElement, Props>(
  ({ as = 'div', asChild, className, ...props }: Props, ref) => {
    const atomProps: Record<string, unknown> = {}
    const nativeProps: Record<string, unknown> = {}

    for (const key in props) {
      if (sprinkles.properties.has(key as keyof Omit<Atoms, 'reset'>)) {
        atomProps[key] = props[key as keyof typeof props]
      } else {
        nativeProps[key] = props[key as keyof typeof props]
      }
    }

    const atomicClasses = atoms({
      reset: typeof as === 'string' ? (as as Atoms['reset']) : 'div',
      ...atomProps,
    })

    const Comp = asChild ? Slot : as

    return React.createElement(Comp, {
      className: clsx(atomicClasses, className),
      ...nativeProps,
      ref,
    })
  },
)

export type AtomBoxProps = Parameters<typeof AtomBox>[0]

AtomBox.displayName = 'AtomBox'
