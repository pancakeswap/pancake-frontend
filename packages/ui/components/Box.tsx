/* eslint-disable no-restricted-syntax */
import * as React from 'react'
import clsx, { ClassValue } from 'clsx'
import { m as motion } from 'framer-motion'
import { ComponentPropsWithoutRef, createElement, ElementType, forwardRef } from 'react'
import { Sprinkles, sprinkles } from '../css/sprinkles.css'
import { Atoms } from '../css/atoms'

// export interface BoxBaseProps extends Omit<Atoms, 'reset'> {
// className?: ClassValue
// }

type HTMLProperties<T = HTMLElement> = Omit<
  React.AllHTMLAttributes<T>,
  'as' | 'className' | 'color' | 'height' | 'width' | 'size'
>

type Props = Atoms &
  HTMLProperties & {
    as?: React.ElementType
    className?: ClassValue
  }

export const Box = forwardRef<HTMLElement, Props>(({ as = 'div', className, ...props }, ref) => {
  const { className: atomicClasses, style, otherProps } = sprinkles(props)

  // for (const key in props) {
  //   if (sprinkles.properties.has(key as keyof Omit<Atoms, "reset">)) {
  //     atomProps[key] = props[key as keyof typeof props];
  //   } else {
  //     nativeProps[key] = props[key as keyof typeof props];
  //   }
  // }

  // const atomicClasses = atoms({
  //   reset: typeof as === "string" ? (as as Atoms["reset"]) : "div",
  //   ...atomProps,
  // });

  return createElement(as, {
    className: clsx(atomicClasses, className),
    style,
    ...otherProps,
    ref,
  })
})

Box.displayName = 'Box'

export type BoxProps = Parameters<typeof Box>[0]

export const MotionBox = forwardRef<HTMLElement, BoxProps>((props, ref) => <Box ref={ref} as={motion.div} {...props} />)
