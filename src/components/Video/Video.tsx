/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'

import styled from 'styled-components'
import { useMatchBreakpoints } from '@rug-zombie-libs/uikit'

interface VideoProps {
  path: string;
}

const Video: React.FC<VideoProps> = ({ path }) => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl

  const maxMobileHeight =  280
  const maxMobileWidth = 260
  return isDesktop ? (
    <video style={{ maxWidth: '90%', maxHeight: '100%' }} autoPlay controls={false} loop muted>
      <source src={path} type='video/webm' />
    </video>
  ) : (
    <div dangerouslySetInnerHTML={{
      __html: `
                <video  autoPlay loop muted style='max-height: ${maxMobileHeight}px; max-width: ${maxMobileWidth}px'>
                  <source src='${path}' type='video/webm' />
                </video>
                `,
    }} />
  )
}

export default Video
