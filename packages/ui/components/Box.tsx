/* eslint-disable no-restricted-syntax */
import { Slot } from '@radix-ui/react-slot'
import clsx, { ClassValue } from 'clsx'
import { m as motion } from 'framer-motion'
import * as React from 'react'
import { createElement, forwardRef } from 'react'
import { Sprinkles, sprinkles } from '../css/sprinkles.css'

type HTMLProperties<T = HTMLElement> = Omit<
  React.AllHTMLAttributes<T>,
  'as' | 'className' | 'color' | 'height' | 'width' | 'size'
>

type Props = Sprinkles &
  HTMLProperties & {
    as?: React.ElementType
    asChild?: boolean
    className?: ClassValue
  }

export const Box = forwardRef<HTMLElement, Props>(({ as = 'div', className, asChild, ...props }, ref) => {
  const { className: atomicClasses, style, otherProps } = sprinkles(props)
  const Comp = asChild ? Slot : as

  return createElement(Comp, {
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
