import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import ProgressSteps from './components/ProgressSteps'

const MigrationPage: React.FC = () => {
  return (
    <Page>
      <ProgressSteps />
    </Page>
  )
}

export default MigrationPage
