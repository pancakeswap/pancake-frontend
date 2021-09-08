import React from 'react'
import PageHeader, { PageHeaderProps } from 'components/PageHeader'

const MarketPageHeader: React.FC<PageHeaderProps> = (props) => (
  <PageHeader background="linear-gradient(111.68deg, #f2ecf2 0%, #e8f2f6 100%)" {...props} />
)

export default MarketPageHeader
