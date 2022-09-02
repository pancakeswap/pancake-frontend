/* eslint-disable no-restricted-syntax */
import clsx, { ClassValue } from 'clsx'
import { m as motion } from 'framer-motion'
import * as React from 'react'
import { createElement, forwardRef } from 'react'
import { Atoms } from '../css/atoms'
import { sprinkles } from '../css/sprinkles.css'

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

  return createElement(as, {
    className: clsx(atomicClasses, className),
    ...otherProps,
    style: {
      ...style,
      ...otherProps.style,
    },
    ref,
  })
})

Box.displayName = 'Box'

export type BoxProps = Parameters<typeof Box>[0]

export const MotionBox = forwardRef<HTMLElement, BoxProps>((props, ref) => <Box ref={ref} as={motion.div} {...props} />)
